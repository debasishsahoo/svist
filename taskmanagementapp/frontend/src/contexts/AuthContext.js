import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { authService } from "../services/authService";

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Authentication state constants
const AUTH_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  ERROR: "error",
};

// Token refresh timing constants
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
const TOKEN_REFRESH_INTERVAL = 60 * 1000; // Check every minute

// Authentication provider component
export const AuthProvider = ({ children }) => {
  // Core authentication state
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState(AUTH_STATES.LOADING);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Session management state
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isSessionWarning, setIsSessionWarning] = useState(false);

  // Refs for cleanup and token management
  const refreshTimeoutRef = useRef(null);
  const activityTimeoutRef = useRef(null);
  const sessionWarningTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Activity tracking for session management
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Clear all authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    setUser(null);
    setSessionExpiry(null);
    setError(null);
    setIsSessionWarning(false);
    setAuthState(AUTH_STATES.UNAUTHENTICATED);
  }, []);

  // Set authentication data
  const setAuthData = useCallback((userData, token, refreshToken = null) => {
    // Store tokens
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    // Calculate token expiry (assuming JWT structure)
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const expiry = tokenPayload.exp * 1000; // Convert to milliseconds
      setSessionExpiry(expiry);
      localStorage.setItem("tokenExpiry", expiry.toString());
    } catch (error) {
      console.warn("Failed to parse token expiry:", error);
      // Fallback: assume 1 hour expiry
      const fallbackExpiry = Date.now() + 60 * 60 * 1000;
      setSessionExpiry(fallbackExpiry);
      localStorage.setItem("tokenExpiry", fallbackExpiry.toString());
    }

    // Set user data and state
    setUser(userData);
    setAuthState(AUTH_STATES.AUTHENTICATED);
    setLastActivity(Date.now());
    setError(null);
  }, []);

  // Token refresh logic
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return false;

    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      clearAuthData();
      return false;
    }

    setIsRefreshing(true);
    try {
      const response = await authService.refreshToken(storedRefreshToken);
      const {
        user: userData,
        token,
        refreshToken: newRefreshToken,
      } = response.data;

      setAuthData(userData, token, newRefreshToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, clearAuthData, setAuthData]);

  // Check if token needs refresh
  const checkTokenRefresh = useCallback(() => {
    if (!sessionExpiry || authState !== AUTH_STATES.AUTHENTICATED) return;

    const timeUntilExpiry = sessionExpiry - Date.now();

    // If token expires soon, refresh it
    if (timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD && timeUntilExpiry > 0) {
      refreshToken();
    }
    // If token is already expired, logout
    else if (timeUntilExpiry <= 0) {
      logout("Session expired");
    }
    // Schedule next check
    else {
      const nextCheck = Math.min(
        timeUntilExpiry - TOKEN_REFRESH_THRESHOLD,
        TOKEN_REFRESH_INTERVAL
      );
      refreshTimeoutRef.current = setTimeout(checkTokenRefresh, nextCheck);
    }
  }, [sessionExpiry, authState, refreshToken]);

  // Session warning logic
  const checkSessionWarning = useCallback(() => {
    if (!sessionExpiry || authState !== AUTH_STATES.AUTHENTICATED) return;

    const timeUntilExpiry = sessionExpiry - Date.now();
    const warningThreshold = 2 * 60 * 1000; // 2 minutes before expiry

    if (
      timeUntilExpiry <= warningThreshold &&
      timeUntilExpiry > 0 &&
      !isSessionWarning
    ) {
      setIsSessionWarning(true);
    } else if (timeUntilExpiry > warningThreshold && isSessionWarning) {
      setIsSessionWarning(false);
    }
  }, [sessionExpiry, authState, isSessionWarning]);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    try {
      const token = localStorage.getItem("token");
      const storedExpiry = localStorage.getItem("tokenExpiry");

      if (!token) {
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
        return;
      }

      // Check if stored token is expired
      if (storedExpiry) {
        const expiry = parseInt(storedExpiry, 10);
        if (Date.now() >= expiry) {
          // Try to refresh token
          const refreshed = await refreshToken();
          if (!refreshed) {
            clearAuthData();
            return;
          }
        } else {
          setSessionExpiry(expiry);
        }
      }

      // Validate token with server
      const userData = await authService.getProfile();
      setUser(userData);
      setAuthState(AUTH_STATES.AUTHENTICATED);
      setLastActivity(Date.now());
    } catch (error) {
      console.error("Auth initialization error:", error);
      // Try token refresh if profile fetch fails
      const refreshed = await refreshToken();
      if (!refreshed) {
        clearAuthData();
      }
    }
  }, [refreshToken, clearAuthData]);

  // Login function
  const login = useCallback(
    async (email, password, rememberMe = false) => {
      try {
        setError(null);
        setAuthState(AUTH_STATES.LOADING);

        const response = await authService.login(email, password);
        const { user: userData, token, refreshToken } = response.data;

        setAuthData(userData, token, refreshToken);

        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        return response;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        setError(errorMessage);
        setAuthState(AUTH_STATES.ERROR);
        throw error;
      }
    },
    [setAuthData]
  );

  // Register function
  const register = useCallback(
    async (username, email, password) => {
      try {
        setError(null);
        setAuthState(AUTH_STATES.LOADING);

        const response = await authService.register(username, email, password);
        const { user: userData, token, refreshToken } = response.data;

        setAuthData(userData, token, refreshToken);

        return response;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        setError(errorMessage);
        setAuthState(AUTH_STATES.ERROR);
        throw error;
      }
    },
    [setAuthData]
  );

  // Logout function
  const logout = useCallback(
    async (reason = null) => {
      try {
        // Clear timeouts
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        if (activityTimeoutRef.current) {
          clearTimeout(activityTimeoutRef.current);
        }
        if (sessionWarningTimeoutRef.current) {
          clearTimeout(sessionWarningTimeoutRef.current);
        }

        // Attempt server-side logout
        try {
          await authService.logout();
        } catch (error) {
          console.warn("Server logout failed:", error);
        }

        // Clear local auth data
        clearAuthData();

        // Show logout reason if provided
        if (reason) {
          setError(`Logged out: ${reason}`);
          setTimeout(() => setError(null), 5000);
        }
      } catch (error) {
        console.error("Logout error:", error);
        // Force clear auth data even if server logout fails
        clearAuthData();
      }
    },
    [clearAuthData]
  );

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await authService.updateProfile(userData);
      setUser(response.data.user);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed.";
      setError(errorMessage);
      throw error;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await authService.changePassword(
        currentPassword,
        newPassword
      );
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password change failed.";
      setError(errorMessage);
      throw error;
    }
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(async (email) => {
    try {
      setError(null);
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password reset request failed.";
      setError(errorMessage);
      throw error;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      setError(null);
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password reset failed.";
      setError(errorMessage);
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Extend session
  const extendSession = useCallback(async () => {
    const success = await refreshToken();
    if (success) {
      setIsSessionWarning(false);
    }
    return success;
  }, [refreshToken]);

  // Check authentication status
  const checkAuthStatus = useCallback(() => {
    return {
      isAuthenticated: authState === AUTH_STATES.AUTHENTICATED,
      isLoading: authState === AUTH_STATES.LOADING,
      isError: authState === AUTH_STATES.ERROR,
      hasError: !!error,
      user,
    };
  }, [authState, error, user]);

  // Activity tracking setup
  useEffect(() => {
    if (authState !== AUTH_STATES.AUTHENTICATED) return;

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      updateActivity();
      // Clear session warning on activity
      if (isSessionWarning) {
        setIsSessionWarning(false);
      }
    };

    // Add activity listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [authState, updateActivity, isSessionWarning]);

  // Token refresh monitoring
  useEffect(() => {
    if (authState === AUTH_STATES.AUTHENTICATED && sessionExpiry) {
      checkTokenRefresh();
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [authState, sessionExpiry, checkTokenRefresh]);

  // Session warning monitoring
  useEffect(() => {
    if (authState === AUTH_STATES.AUTHENTICATED && sessionExpiry) {
      const checkWarning = () => {
        checkSessionWarning();
        sessionWarningTimeoutRef.current = setTimeout(checkWarning, 30000); // Check every 30 seconds
      };
      checkWarning();
    }

    return () => {
      if (sessionWarningTimeoutRef.current) {
        clearTimeout(sessionWarningTimeoutRef.current);
      }
    };
  }, [authState, sessionExpiry, checkSessionWarning]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      if (sessionWarningTimeoutRef.current)
        clearTimeout(sessionWarningTimeoutRef.current);
    };
  }, []);

  // Context value
  const value = {
    // Core state
    user,
    error,
    loading: authState === AUTH_STATES.LOADING,
    isAuthenticated: authState === AUTH_STATES.AUTHENTICATED,
    isRefreshing,

    // Session management
    sessionExpiry,
    lastActivity,
    isSessionWarning,

    // Auth actions
    login,
    register,
    logout,
    clearError,

    // Profile actions
    updateProfile,
    changePassword,

    // Password reset
    requestPasswordReset,
    resetPassword,

    // Session actions
    extendSession,
    refreshToken,

    // Utility functions
    checkAuthStatus,
    updateActivity,

    // Constants
    authStates: AUTH_STATES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Higher-order component for authentication requirement
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="auth-loading">
          <div className="spinner"></div>
          <p>Checking authentication...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access this content.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Hook for authentication guards
export const useAuthGuard = (redirectTo = "/login") => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  return { isAuthenticated, loading };
};

// Hook for session management
export const useSession = () => {
  const {
    sessionExpiry,
    lastActivity,
    isSessionWarning,
    extendSession,
    logout,
    updateActivity,
  } = useAuth();

  const getTimeUntilExpiry = useCallback(() => {
    if (!sessionExpiry) return null;
    return Math.max(0, sessionExpiry - Date.now());
  }, [sessionExpiry]);

  const getFormattedTimeUntilExpiry = useCallback(() => {
    const timeLeft = getTimeUntilExpiry();
    if (!timeLeft) return null;

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [getTimeUntilExpiry]);

  return {
    sessionExpiry,
    lastActivity,
    isSessionWarning,
    extendSession,
    logout,
    updateActivity,
    timeUntilExpiry: getTimeUntilExpiry(),
    formattedTimeUntilExpiry: getFormattedTimeUntilExpiry(),
  };
};

export default AuthContext;

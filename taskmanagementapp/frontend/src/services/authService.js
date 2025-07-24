import api from "./api";

// Authentication endpoints
const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  CHECK_USERNAME: "/auth/check-username",
  CHECK_EMAIL: "/auth/check-email",
  REVOKE_TOKENS: "/auth/revoke-tokens",
  SESSIONS: "/auth/sessions",
  TWO_FACTOR: "/auth/two-factor",
  BACKUP_CODES: "/auth/backup-codes",
};

// Token management utilities
const TokenManager = {
  // Get stored token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },

  // Store tokens securely
  setTokens: (token, refreshToken = null) => {
    if (token) {
      localStorage.setItem("token", token);

      // Parse token to get expiry
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = payload.exp * 1000;
        localStorage.setItem("tokenExpiry", expiryTime.toString());
      } catch (error) {
        console.warn("Failed to parse token expiry:", error);
      }
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  },

  // Clear all tokens
  clearTokens: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("rememberMe");
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return true;

    return Date.now() >= parseInt(expiry, 10);
  },

  // Get time until token expires
  getTimeUntilExpiry: () => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return 0;

    return Math.max(0, parseInt(expiry, 10) - Date.now());
  },

  // Check if refresh is needed (within 5 minutes of expiry)
  needsRefresh: () => {
    const timeUntilExpiry = TokenManager.getTimeUntilExpiry();
    return timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0;
  },
};

// Input validation utilities
const ValidationUtils = {
  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password) => {
    const errors = [];

    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: ValidationUtils.calculatePasswordStrength(password),
    };
  },

  // Calculate password strength (0-4)
  calculatePasswordStrength: (password) => {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 4);
  },

  // Validate username format
  validateUsername: (username) => {
    const errors = [];

    if (username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    if (username.length > 30) {
      errors.push("Username cannot exceed 30 characters");
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Main authentication service
export const authService = {
  // User authentication
  async login(email, password, rememberMe = false) {
    try {
      // Validate input
      if (!ValidationUtils.validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
        email: email.toLowerCase().trim(),
        password,
        rememberMe,
      });

      const { user, token, refreshToken } = response.data.data;

      // Store tokens
      TokenManager.setTokens(token, refreshToken);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", email.toLowerCase().trim());
      }

      return {
        success: true,
        data: { user, token, refreshToken },
        message: response.data.message || "Login successful",
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  },

  // User registration
  async register(username, email, password) {
    try {
      // Validate input
      const usernameValidation = ValidationUtils.validateUsername(username);
      if (!usernameValidation.isValid) {
        throw new Error(usernameValidation.errors[0]);
      }

      if (!ValidationUtils.validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const passwordValidation = ValidationUtils.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const response = await api.post(AUTH_ENDPOINTS.REGISTER, {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

      const { user, token, refreshToken } = response.data.data;

      // Store tokens
      TokenManager.setTokens(token, refreshToken);

      return {
        success: true,
        data: { user, token, refreshToken },
        message: response.data.message || "Registration successful",
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  },

  // User logout
  async logout() {
    try {
      // Attempt server-side logout
      const token = TokenManager.getToken();
      if (token) {
        try {
          await api.post(AUTH_ENDPOINTS.LOGOUT);
        } catch (error) {
          console.warn("Server logout failed:", error);
          // Continue with client-side logout even if server logout fails
        }
      }

      // Clear local storage
      TokenManager.clearTokens();

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);
      // Force clear tokens even if logout fails
      TokenManager.clearTokens();
      throw new Error("Logout failed");
    }
  },

  // Refresh authentication token
  async refreshToken(refreshToken = null) {
    try {
      const token = refreshToken || TokenManager.getRefreshToken();

      if (!token) {
        throw new Error("No refresh token available");
      }

      const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
        refreshToken: token,
      });

      const {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
      } = response.data.data;

      // Update stored tokens
      TokenManager.setTokens(newToken, newRefreshToken);

      return {
        success: true,
        data: { user, token: newToken, refreshToken: newRefreshToken },
        message: "Token refreshed successfully",
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      // Clear tokens on refresh failure
      TokenManager.clearTokens();
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get(AUTH_ENDPOINTS.PROFILE);
      return response.data.data.user;
    } catch (error) {
      console.error("Get profile error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      // Validate email if provided
      if (userData.email && !ValidationUtils.validateEmail(userData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate username if provided
      if (userData.username) {
        const usernameValidation = ValidationUtils.validateUsername(
          userData.username
        );
        if (!usernameValidation.isValid) {
          throw new Error(usernameValidation.errors[0]);
        }
      }

      const response = await api.put(AUTH_ENDPOINTS.UPDATE_PROFILE, {
        ...userData,
        email: userData.email?.toLowerCase().trim(),
        username: userData.username?.trim(),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Profile updated successfully",
      };
    } catch (error) {
      console.error("Update profile error:", error);
      throw new Error(error.response?.data?.message || "Profile update failed");
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      if (!currentPassword) {
        throw new Error("Current password is required");
      }

      const passwordValidation = ValidationUtils.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const response = await api.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || "Password changed successfully",
      };
    } catch (error) {
      console.error("Change password error:", error);
      throw new Error(
        error.response?.data?.message || "Password change failed"
      );
    }
  },

  // Request password reset
  async requestPasswordReset(email) {
    try {
      if (!ValidationUtils.validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        email: email.toLowerCase().trim(),
      });

      return {
        success: true,
        message: response.data.message || "Password reset email sent",
      };
    } catch (error) {
      console.error("Password reset request error:", error);
      throw new Error(
        error.response?.data?.message || "Password reset request failed"
      );
    }
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      if (!token) {
        throw new Error("Reset token is required");
      }

      const passwordValidation = ValidationUtils.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || "Password reset successfully",
      };
    } catch (error) {
      console.error("Password reset error:", error);
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  },

  // Email verification
  async verifyEmail(token) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });

      return {
        success: true,
        message: response.data.message || "Email verified successfully",
      };
    } catch (error) {
      console.error("Email verification error:", error);
      throw new Error(
        error.response?.data?.message || "Email verification failed"
      );
    }
  },

  // Resend email verification
  async resendEmailVerification() {
    try {
      const response = await api.post(AUTH_ENDPOINTS.RESEND_VERIFICATION);

      return {
        success: true,
        message: response.data.message || "Verification email sent",
      };
    } catch (error) {
      console.error("Resend verification error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send verification email"
      );
    }
  },

  // Check username availability
  async checkUsernameAvailability(username) {
    try {
      const usernameValidation = ValidationUtils.validateUsername(username);
      if (!usernameValidation.isValid) {
        return {
          available: false,
          errors: usernameValidation.errors,
        };
      }

      const response = await api.get(AUTH_ENDPOINTS.CHECK_USERNAME, {
        username: username.trim(),
      });

      return {
        available: response.data.data.available,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Username check error:", error);
      return {
        available: false,
        error:
          error.response?.data?.message ||
          "Failed to check username availability",
      };
    }
  },

  // Check email availability
  async checkEmailAvailability(email) {
    try {
      if (!ValidationUtils.validateEmail(email)) {
        return {
          available: false,
          errors: ["Please enter a valid email address"],
        };
      }

      const response = await api.get(AUTH_ENDPOINTS.CHECK_EMAIL, {
        email: email.toLowerCase().trim(),
      });

      return {
        available: response.data.data.available,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Email check error:", error);
      return {
        available: false,
        error:
          error.response?.data?.message || "Failed to check email availability",
      };
    }
  },

  // Get active sessions
  async getSessions() {
    try {
      const response = await api.get(AUTH_ENDPOINTS.SESSIONS);

      return {
        success: true,
        data: response.data.data.sessions,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Get sessions error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch sessions"
      );
    }
  },

  // Revoke all tokens/sessions
  async revokeAllTokens() {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REVOKE_TOKENS);

      // Clear local tokens
      TokenManager.clearTokens();

      return {
        success: true,
        message: response.data.message || "All sessions revoked successfully",
      };
    } catch (error) {
      console.error("Revoke tokens error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to revoke sessions"
      );
    }
  },

  // Two-factor authentication
  async enableTwoFactor() {
    try {
      const response = await api.post(`${AUTH_ENDPOINTS.TWO_FACTOR}/enable`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Two-factor authentication enabled",
      };
    } catch (error) {
      console.error("Enable 2FA error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to enable two-factor authentication"
      );
    }
  },

  async disableTwoFactor(password) {
    try {
      const response = await api.post(`${AUTH_ENDPOINTS.TWO_FACTOR}/disable`, {
        password,
      });

      return {
        success: true,
        message: response.data.message || "Two-factor authentication disabled",
      };
    } catch (error) {
      console.error("Disable 2FA error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to disable two-factor authentication"
      );
    }
  },

  async verifyTwoFactor(code) {
    try {
      const response = await api.post(`${AUTH_ENDPOINTS.TWO_FACTOR}/verify`, {
        code,
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Two-factor code verified",
      };
    } catch (error) {
      console.error("Verify 2FA error:", error);
      throw new Error(
        error.response?.data?.message || "Invalid two-factor code"
      );
    }
  },

  // Backup codes for 2FA
  async generateBackupCodes() {
    try {
      const response = await api.post(AUTH_ENDPOINTS.BACKUP_CODES);

      return {
        success: true,
        data: response.data.data.codes,
        message: response.data.message || "Backup codes generated",
      };
    } catch (error) {
      console.error("Generate backup codes error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to generate backup codes"
      );
    }
  },

  // Utility functions
  isAuthenticated: () => {
    const token = TokenManager.getToken();
    return !!token && !TokenManager.isTokenExpired();
  },

  hasValidToken: () => {
    return !!TokenManager.getToken();
  },

  needsTokenRefresh: () => {
    return TokenManager.needsRefresh();
  },

  getStoredEmail: () => {
    return localStorage.getItem("rememberedEmail") || "";
  },

  clearStoredEmail: () => {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberMe");
  },

  // Validation utilities (exposed for components)
  validateEmail: ValidationUtils.validateEmail,
  validatePassword: ValidationUtils.validatePassword,
  validateUsername: ValidationUtils.validateUsername,
  calculatePasswordStrength: ValidationUtils.calculatePasswordStrength,
};

export default authService;

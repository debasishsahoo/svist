import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./AuthForm.css";

const Login = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Hooks
  const { login, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailInputRef = useRef(null);

  // Get the intended destination from location state, default to tasks
  const from = location.state?.from?.pathname || "/tasks";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Clear errors when component mounts and focus email input
  useEffect(() => {
    clearError();
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }

    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, [clearError]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear global error when user makes changes
    if (error) {
      clearError();
    }
  };

  // Handle checkbox changes
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  // Client-side validation
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      await login(formData.email.trim().toLowerCase(), formData.password);

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          formData.email.trim().toLowerCase()
        );
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Navigation will be handled by useEffect when user state changes
    } catch (error) {
      // Error is handled by AuthContext and will be displayed via error state
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle demo login (for development/demo purposes)
  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@taskmanager.com",
      password: "demo123",
    });

    setIsSubmitting(true);
    try {
      await login("demo@taskmanager.com", "demo123");
    } catch (error) {
      console.error("Demo login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Enter to submit form
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isSubmitting) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [formData, isSubmitting]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <h1>🚀</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>

          {location.state?.message && (
            <div className="auth-info-message">{location.state.message}</div>
          )}
        </div>

        {/* Error Message */}
        <ErrorMessage message={error} onDismiss={clearError} />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${
                  validationErrors.email ? "error" : ""
                }`}
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={isSubmitting}
                aria-describedby={
                  validationErrors.email ? "email-error" : undefined
                }
              />
              <span className="input-icon">📧</span>
            </div>
            {validationErrors.email && (
              <div id="email-error" className="form-error" role="alert">
                {validationErrors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${
                  validationErrors.password ? "error" : ""
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-describedby={
                  validationErrors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={handleShowPasswordToggle}
                className="password-toggle"
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {validationErrors.password && (
              <div id="password-error" className="form-error" role="alert">
                {validationErrors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                disabled={isSubmitting}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Remember me</span>
            </label>

            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={
              isSubmitting || !formData.email.trim() || !formData.password
            }
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" message="" />
                <span style={{ marginLeft: "8px" }}>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Demo Login Button (for development) */}
          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-outline btn-secondary demo-login"
              disabled={isSubmitting}
            >
              🎭 Demo Login
            </button>
          )}
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Social Login Options (placeholder for future implementation) */}
        <div className="social-login">
          <button
            type="button"
            className="btn btn-outline btn-social google-login"
            disabled={true}
            title="Coming soon"
          >
            🌐 Continue with Google
          </button>
          <button
            type="button"
            className="btn btn-outline btn-social github-login"
            disabled={true}
            title="Coming soon"
          >
            💻 Continue with GitHub
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>

          <div className="auth-help">
            <small>
              Having trouble?{" "}
              <a href="mailto:support@taskmanager.com">Contact support</a>
            </small>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="auth-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="keyboard-hint">
        <small>💡 Tip: Press Ctrl/Cmd + Enter to sign in quickly</small>
      </div>
    </div>
  );
};

export default Login;

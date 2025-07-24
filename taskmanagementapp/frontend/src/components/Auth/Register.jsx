import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./AuthForm.css";

const Register = () => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Hooks
  const { register, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const usernameInputRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/tasks", { replace: true });
    }
  }, [user, navigate]);

  // Clear errors when component mounts and focus username input
  useEffect(() => {
    clearError();
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [clearError]);

  // Calculate password strength
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 6) strength += 1;
      if (password.length >= 8) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      return Math.min(strength, 4);
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

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
  const handleTermsChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleShowPasswordToggle = (field) => {
    if (field === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  // Check username availability (debounced)
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    if (formData.username.length >= 3) {
      const timeout = setTimeout(async () => {
        setCheckingUsername(true);
        try {
          // Simulated username check - in real app, call API
          // const available = await authService.checkUsernameAvailability(formData.username);
          const available = !["admin", "user", "test", "demo"].includes(
            formData.username.toLowerCase()
          );
          setUsernameAvailable(available);
        } catch (error) {
          console.error("Username check failed:", error);
        } finally {
          setCheckingUsername(false);
        }
      }, 500);

      setUsernameCheckTimeout(timeout);
    } else {
      setUsernameAvailable(null);
    }

    return () => {
      if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout);
    };
  }, [formData.username]);

  // Client-side validation
  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    } else if (formData.username.length > 30) {
      errors.username = "Username cannot exceed 30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    } else if (usernameAvailable === false) {
      errors.username = "This username is already taken";
    }

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
      errors.password = "Password must be at least 6 characters long";
    } else if (passwordStrength < 2) {
      errors.password =
        "Password is too weak. Include uppercase, lowercase, and numbers.";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!agreedToTerms) {
      errors.terms =
        "You must agree to the Terms of Service and Privacy Policy";
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
      await register(
        formData.username.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );

      // Registration successful - user will be redirected by useEffect
    } catch (error) {
      // Error is handled by AuthContext and will be displayed via error state
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get password strength info
  const getPasswordStrengthInfo = () => {
    const strengthLevels = [
      { label: "Very Weak", color: "#dc3545", width: "20%" },
      { label: "Weak", color: "#fd7e14", width: "40%" },
      { label: "Fair", color: "#ffc107", width: "60%" },
      { label: "Good", color: "#20c997", width: "80%" },
      { label: "Strong", color: "#28a745", width: "100%" },
    ];

    return strengthLevels[passwordStrength] || strengthLevels[0];
  };

  const passwordStrengthInfo = getPasswordStrengthInfo();

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
  }, [formData, isSubmitting, agreedToTerms]);

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <h1>🚀</h1>
          </div>
          <h2>Create Your Account</h2>
          <p>Join thousands of users organizing their tasks efficiently</p>
        </div>

        {/* Error Message */}
        <ErrorMessage message={error} onDismiss={clearError} />

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-wrapper">
              <input
                ref={usernameInputRef}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${
                  validationErrors.username ? "error" : ""
                } ${usernameAvailable === true ? "success" : ""}`}
                placeholder="Choose a unique username"
                autoComplete="username"
                disabled={isSubmitting}
                aria-describedby={
                  validationErrors.username ? "username-error" : undefined
                }
              />
              <span className="input-icon">👤</span>
              {checkingUsername && (
                <div className="input-status checking">
                  <LoadingSpinner size="small" message="" />
                </div>
              )}
              {usernameAvailable === true && (
                <div className="input-status available">✅</div>
              )}
              {usernameAvailable === false && (
                <div className="input-status taken">❌</div>
              )}
            </div>
            {validationErrors.username && (
              <div id="username-error" className="form-error" role="alert">
                {validationErrors.username}
              </div>
            )}
            {usernameAvailable === true && (
              <div className="form-success">Username is available!</div>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <input
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
                placeholder="Create a strong password"
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-describedby={
                  validationErrors.password
                    ? "password-error"
                    : "password-strength"
                }
              />
              <button
                type="button"
                onClick={() => handleShowPasswordToggle("password")}
                className="password-toggle"
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength" id="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: passwordStrengthInfo.width,
                      backgroundColor: passwordStrengthInfo.color,
                    }}
                  ></div>
                </div>
                <span
                  className="strength-label"
                  style={{ color: passwordStrengthInfo.color }}
                >
                  {passwordStrengthInfo.label}
                </span>
              </div>
            )}

            {validationErrors.password && (
              <div id="password-error" className="form-error" role="alert">
                {validationErrors.password}
              </div>
            )}

            {/* Password Requirements */}
            <div className="password-requirements">
              <small>Password must contain:</small>
              <ul>
                <li className={formData.password.length >= 6 ? "met" : ""}>
                  At least 6 characters
                </li>
                <li className={/[a-z]/.test(formData.password) ? "met" : ""}>
                  One lowercase letter
                </li>
                <li className={/[A-Z]/.test(formData.password) ? "met" : ""}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? "met" : ""}>
                  One number
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${
                  validationErrors.confirmPassword ? "error" : ""
                } ${
                  formData.confirmPassword &&
                  formData.password === formData.confirmPassword
                    ? "success"
                    : ""
                }`}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-describedby={
                  validationErrors.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
              />
              <button
                type="button"
                onClick={() => handleShowPasswordToggle("confirmPassword")}
                className="password-toggle"
                disabled={isSubmitting}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <div className="input-status match">✅</div>
                )}
            </div>
            {validationErrors.confirmPassword && (
              <div
                id="confirm-password-error"
                className="form-error"
                role="alert"
              >
                {validationErrors.confirmPassword}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleTermsChange}
                disabled={isSubmitting}
                className="checkbox-input"
                aria-describedby={
                  validationErrors.terms ? "terms-error" : undefined
                }
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </span>
            </label>
            {validationErrors.terms && (
              <div id="terms-error" className="form-error" role="alert">
                {validationErrors.terms}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={
              isSubmitting ||
              !formData.username.trim() ||
              !formData.email.trim() ||
              !formData.password ||
              !formData.confirmPassword ||
              !agreedToTerms ||
              usernameAvailable === false
            }
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" message="" />
                <span style={{ marginLeft: "8px" }}>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Social Registration Options (placeholder for future implementation) */}
        <div className="social-login">
          <button
            type="button"
            className="btn btn-outline btn-social google-login"
            disabled={true}
            title="Coming soon"
          >
            🌐 Sign up with Google
          </button>
          <button
            type="button"
            className="btn btn-outline btn-social github-login"
            disabled={true}
            title="Coming soon"
          >
            💻 Sign up with GitHub
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>

          <div className="auth-help">
            <small>
              Need help?{" "}
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
        <small>💡 Tip: Press Ctrl/Cmd + Enter to create account quickly</small>
      </div>
    </div>
  );
};

export default Register;

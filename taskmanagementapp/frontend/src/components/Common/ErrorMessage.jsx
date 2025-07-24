import React, { useState, useEffect } from "react";
import "./ErrorMessage.css";

const ErrorMessage = ({
  message,
  type = "error",
  onRetry,
  onDismiss,
  autoHide = false,
  autoHideDelay = 5000,
  showIcon = true,
  showActions = true,
  persistent = false,
  className = "",
  testId = "error-message",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Show/hide animation control
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsAnimatingOut(false);
    } else {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }
  }, [message]);

  // Auto-hide functionality
  useEffect(() => {
    if (message && autoHide && !persistent) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [message, autoHide, autoHideDelay, persistent]);

  // Handle dismiss with animation
  const handleDismiss = () => {
    if (!onDismiss) return;

    setIsAnimatingOut(true);
    setTimeout(() => {
      onDismiss();
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 300); // Match CSS animation duration
  };

  // Handle retry action
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  // Get error type configuration
  const getErrorConfig = () => {
    const configs = {
      error: {
        icon: "❌",
        bgColor: "#fee",
        borderColor: "#fecaca",
        textColor: "#991b1b",
        iconColor: "#dc2626",
      },
      warning: {
        icon: "⚠️",
        bgColor: "#fffbeb",
        borderColor: "#fed7aa",
        textColor: "#92400e",
        iconColor: "#f59e0b",
      },
      info: {
        icon: "ℹ️",
        bgColor: "#eff6ff",
        borderColor: "#bfdbfe",
        textColor: "#1e40af",
        iconColor: "#3b82f6",
      },
      success: {
        icon: "✅",
        bgColor: "#f0fdf4",
        borderColor: "#bbf7d0",
        textColor: "#166534",
        iconColor: "#16a34a",
      },
      network: {
        icon: "🌐",
        bgColor: "#f8fafc",
        borderColor: "#cbd5e1",
        textColor: "#334155",
        iconColor: "#64748b",
      },
      validation: {
        icon: "📝",
        bgColor: "#fef3c7",
        borderColor: "#fde68a",
        textColor: "#92400e",
        iconColor: "#f59e0b",
      },
    };

    return configs[type] || configs.error;
  };

  // Parse error message for better display
  const parseErrorMessage = (msg) => {
    if (!msg) return null;

    // Handle different error formats
    if (typeof msg === "string") {
      return msg;
    }

    if (msg.message) {
      return msg.message;
    }

    if (Array.isArray(msg)) {
      return msg.join(", ");
    }

    if (typeof msg === "object") {
      return JSON.stringify(msg, null, 2);
    }

    return "An unexpected error occurred";
  };

  // Get retry button text based on error type
  const getRetryText = () => {
    const retryTexts = {
      network: "Retry Connection",
      error: "Try Again",
      warning: "Retry",
      info: "Refresh",
      validation: "Try Again",
    };

    return retryTexts[type] || "Retry";
  };

  // Extract helpful error details
  const getErrorDetails = (msg) => {
    if (typeof msg === "string") {
      // Common error patterns
      if (msg.includes("Network")) return "Check your internet connection";
      if (msg.includes("timeout")) return "Request timed out";
      if (msg.includes("401") || msg.includes("unauthorized"))
        return "Authentication required";
      if (msg.includes("403") || msg.includes("forbidden"))
        return "Access denied";
      if (msg.includes("404") || msg.includes("not found"))
        return "Resource not found";
      if (msg.includes("500") || msg.includes("server error"))
        return "Server error occurred";
    }
    return null;
  };

  // Don't render if no message
  if (!message || !isVisible) {
    return null;
  }

  const config = getErrorConfig();
  const parsedMessage = parseErrorMessage(message);
  const errorDetails = getErrorDetails(message);

  return (
    <div
      className={`error-message error-message--${type} ${
        isAnimatingOut ? "error-message--hiding" : ""
      } ${className}`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: config.textColor,
      }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      data-testid={testId}
    >
      <div className="error-message__content">
        {/* Icon */}
        {showIcon && (
          <div
            className="error-message__icon"
            style={{ color: config.iconColor }}
            aria-hidden="true"
          >
            {config.icon}
          </div>
        )}

        {/* Message Content */}
        <div className="error-message__text">
          <div className="error-message__primary">{parsedMessage}</div>

          {errorDetails && (
            <div className="error-message__details">{errorDetails}</div>
          )}

          {/* Error Code Display for Development */}
          {process.env.NODE_ENV === "development" &&
            typeof message === "object" && (
              <details className="error-message__debug">
                <summary>Debug Info</summary>
                <pre>{JSON.stringify(message, null, 2)}</pre>
              </details>
            )}
        </div>

        {/* Action Buttons */}
        {showActions && (onRetry || onDismiss) && (
          <div className="error-message__actions">
            {onRetry && (
              <button
                onClick={handleRetry}
                className="error-message__action error-message__action--retry"
                type="button"
                aria-label={`${getRetryText()} - ${parsedMessage}`}
              >
                <span className="error-message__action-icon">🔄</span>
                {getRetryText()}
              </button>
            )}

            {onDismiss && !persistent && (
              <button
                onClick={handleDismiss}
                className="error-message__action error-message__action--dismiss"
                type="button"
                aria-label={`Dismiss error - ${parsedMessage}`}
              >
                <span className="error-message__action-icon">✕</span>
                <span className="sr-only">Dismiss</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress bar for auto-hide */}
      {autoHide && !persistent && (
        <div
          className="error-message__progress"
          style={{
            animationDuration: `${autoHideDelay}ms`,
            backgroundColor: config.iconColor,
          }}
        />
      )}
    </div>
  );
};

// Compound component for multiple errors
ErrorMessage.List = ({ errors, ...props }) => {
  if (!errors || !Array.isArray(errors) || errors.length === 0) {
    return null;
  }

  return (
    <div className="error-message-list">
      {errors.map((error, index) => (
        <ErrorMessage
          key={index}
          message={error.message || error}
          type={error.type || "error"}
          {...props}
        />
      ))}
    </div>
  );
};

// Toast-like error message that appears at the top of the screen
ErrorMessage.Toast = ({ message, ...props }) => {
  if (!message) return null;

  return (
    <div className="error-message-toast">
      <ErrorMessage
        message={message}
        autoHide={true}
        autoHideDelay={4000}
        {...props}
      />
    </div>
  );
};

// Inline error message for form fields
ErrorMessage.Inline = ({ message, field, ...props }) => {
  if (!message) return null;

  return (
    <ErrorMessage
      message={message}
      type="validation"
      showActions={false}
      className="error-message--inline"
      testId={`error-${field}`}
      {...props}
    />
  );
};

// Network-specific error message with reconnection logic
ErrorMessage.Network = ({ message, onRetry, isRetrying, ...props }) => {
  return (
    <ErrorMessage
      message={
        message ||
        "Network connection lost. Please check your internet connection."
      }
      type="network"
      onRetry={onRetry}
      showIcon={true}
      className={`error-message--network ${
        isRetrying ? "error-message--retrying" : ""
      }`}
      {...props}
    />
  );
};

export default ErrorMessage;

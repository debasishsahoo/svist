import React,{useState,useEffect} from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  size = "medium",
  message = "Loading...",
  variant = "default",
  color = "primary",
  overlay = false,
  fullScreen = false,
  showMessage = true,
  inline = false,
  className = "",
  testId = "loading-spinner",
  delay = 0,
  progress = null,
  children,
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      spinner: 20,
      fontSize: 12,
      gap: 6,
    },
    medium: {
      spinner: 40,
      fontSize: 14,
      gap: 10,
    },
    large: {
      spinner: 60,
      fontSize: 16,
      gap: 15,
    },
    xlarge: {
      spinner: 80,
      fontSize: 18,
      gap: 20,
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Get spinner variant component
  const getSpinnerVariant = () => {
    switch (variant) {
      case "dots":
        return <DotsSpinner size={config.spinner} color={color} />;
      case "pulse":
        return <PulseSpinner size={config.spinner} color={color} />;
      case "bars":
        return <BarsSpinner size={config.spinner} color={color} />;
      case "ring":
        return <RingSpinner size={config.spinner} color={color} />;
      case "ripple":
        return <RippleSpinner size={config.spinner} color={color} />;
      case "bounce":
        return <BounceSpinner size={config.spinner} color={color} />;
      case "progress":
        return (
          <ProgressSpinner
            size={config.spinner}
            color={color}
            progress={progress}
          />
        );
      default:
        return <DefaultSpinner size={config.spinner} color={color} />;
    }
  };

  // Container classes
  const containerClasses = [
    "loading-spinner",
    `loading-spinner--${size}`,
    `loading-spinner--${color}`,
    overlay && "loading-spinner--overlay",
    fullScreen && "loading-spinner--fullscreen",
    inline && "loading-spinner--inline",
    !showMessage && "loading-spinner--no-message",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Container style with delay
  const containerStyle = {
    "--spinner-size": `${config.spinner}px`,
    "--font-size": `${config.fontSize}px`,
    "--gap": `${config.gap}px`,
    ...(delay > 0 && { animationDelay: `${delay}ms` }),
  };

  const SpinnerContent = () => (
    <div className="loading-spinner__content">
      <div className="loading-spinner__icon">{getSpinnerVariant()}</div>

      {showMessage && message && (
        <div className="loading-spinner__message">{message}</div>
      )}

      {children && <div className="loading-spinner__children">{children}</div>}

      {progress !== null && variant !== "progress" && (
        <div className="loading-spinner__progress">
          <div className="loading-spinner__progress-bar">
            <div
              className="loading-spinner__progress-fill"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <div className="loading-spinner__progress-text">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      role="status"
      aria-label={message || "Loading"}
      aria-live="polite"
      data-testid={testId}
    >
      <SpinnerContent />
    </div>
  );
};

// Default circular spinner
const DefaultSpinner = ({ size, color }) => (
  <svg
    className="spinner spinner--default"
    width={size}
    height={size}
    viewBox="0 0 50 50"
  >
    <circle
      className="spinner__path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="31.416"
      strokeDashoffset="31.416"
    />
  </svg>
);

// Animated dots spinner
const DotsSpinner = ({ size, color }) => (
  <div className="spinner spinner--dots" style={{ width: size, height: size }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="spinner__dot"
        style={{ animationDelay: `${i * 0.16}s` }}
      />
    ))}
  </div>
);

// Pulsing circle spinner
const PulseSpinner = ({ size, color }) => (
  <div className="spinner spinner--pulse" style={{ width: size, height: size }}>
    <div className="spinner__pulse" />
    <div className="spinner__pulse" />
  </div>
);

// Animated bars spinner
const BarsSpinner = ({ size, color }) => (
  <div className="spinner spinner--bars" style={{ width: size, height: size }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="spinner__bar"
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

// Ring spinner with gradient
const RingSpinner = ({ size, color }) => (
  <div className="spinner spinner--ring" style={{ width: size, height: size }}>
    <div className="spinner__ring" />
  </div>
);

// Ripple effect spinner
const RippleSpinner = ({ size, color }) => (
  <div
    className="spinner spinner--ripple"
    style={{ width: size, height: size }}
  >
    <div className="spinner__ripple" />
    <div className="spinner__ripple" />
  </div>
);

// Bouncing balls spinner
const BounceSpinner = ({ size, color }) => (
  <div
    className="spinner spinner--bounce"
    style={{ width: size, height: size }}
  >
    <div className="spinner__bounce" />
    <div className="spinner__bounce" />
    <div className="spinner__bounce" />
  </div>
);

// Progress circle spinner
const ProgressSpinner = ({ size, color, progress = 0 }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="spinner spinner--progress"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40">
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.2"
        />
        {/* Progress circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 20 20)"
          className="spinner__progress-circle"
        />
      </svg>
      <div className="spinner__progress-percentage">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Skeleton loader for content placeholders
LoadingSpinner.Skeleton = ({
  width = "100%",
  height = "20px",
  className = "",
  lines = 1,
  avatar = false,
  rounded = false,
}) => {
  if (lines > 1) {
    return (
      <div className={`skeleton-container ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="skeleton skeleton--line"
            style={{
              width: i === lines - 1 ? "60%" : "100%",
              height: "16px",
              marginBottom: i < lines - 1 ? "8px" : "0",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${avatar ? "skeleton--avatar" : ""} ${
        rounded ? "skeleton--rounded" : ""
      } ${className}`}
      style={{ width, height }}
    />
  );
};

// Button loading state
LoadingSpinner.Button = ({
  loading = false,
  children,
  size = "small",
  position = "left",
  ...props
}) => {
  if (!loading) return children;

  return (
    <span className={`button-loading button-loading--${position}`}>
      {position === "left" && (
        <LoadingSpinner
          size={size}
          showMessage={false}
          inline={true}
          variant="default"
        />
      )}
      <span className={loading ? "button-loading__text" : ""}>{children}</span>
      {position === "right" && (
        <LoadingSpinner
          size={size}
          showMessage={false}
          inline={true}
          variant="default"
        />
      )}
    </span>
  );
};

// Page loading overlay
LoadingSpinner.Page = ({ message = "Loading page...", ...props }) => (
  <LoadingSpinner
    size="large"
    message={message}
    fullScreen={true}
    variant="default"
    {...props}
  />
);

// Content loading overlay
LoadingSpinner.Overlay = ({
  message = "Loading...",
  children,
  loading = true,
  ...props
}) => (
  <div className="loading-overlay-container">
    {children}
    {loading && (
      <LoadingSpinner
        message={message}
        overlay={true}
        variant="default"
        {...props}
      />
    )}
  </div>
);

// Table loading placeholder
LoadingSpinner.Table = ({ rows = 5, columns = 4 }) => (
  <div className="table-loading">
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="table-loading__row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <LoadingSpinner.Skeleton
            key={colIndex}
            height="16px"
            className="table-loading__cell"
          />
        ))}
      </div>
    ))}
  </div>
);

// Card loading placeholder
LoadingSpinner.Card = ({ showAvatar = false, lines = 3 }) => (
  <div className="card-loading">
    {showAvatar && (
      <LoadingSpinner.Skeleton
        width="48px"
        height="48px"
        avatar={true}
        className="card-loading__avatar"
      />
    )}
    <div className="card-loading__content">
      <LoadingSpinner.Skeleton
        height="20px"
        width="70%"
        className="card-loading__title"
      />
      <LoadingSpinner.Skeleton lines={lines} className="card-loading__text" />
    </div>
  </div>
);

// Delayed loading spinner (shows after delay)
function DelayedSpinner({ delay = 500, children, ...props }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return <LoadingSpinner {...props}>{children}</LoadingSpinner>;
}
LoadingSpinner.Delayed = DelayedSpinner;

// Lazy loading wrapper
LoadingSpinner.Lazy = ({ loading, fallback, children, error, onRetry }) => {
  if (error) {
    return (
      <div className="lazy-loading-error">
        <p>Failed to load content</p>
        {onRetry && (
          <button onClick={onRetry} className="lazy-loading-retry">
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return fallback || <LoadingSpinner message="Loading content..." />;
  }

  return children;
};

export default LoadingSpinner;

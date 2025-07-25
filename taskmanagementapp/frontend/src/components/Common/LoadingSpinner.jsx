import React from "react";

function LoadingSpinner({ size = "medium" }) {
  const getSize = () => {
    switch (size) {
      case "small":
        return "20px";
      case "large":
        return "50px";
      default:
        return "30px";
    }
  };

  const spinnerStyle = {
    width: getSize(),
    height: getSize(),
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: size === "small" ? "0" : "20px auto",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...(size !== "small" && { minHeight: "200px" }),
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default LoadingSpinner;

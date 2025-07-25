import React from "react";

function ErrorMessage({ message, onClose }) {
  const errorStyle = {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px 16px",
    borderRadius: "4px",
    border: "1px solid #f5c6cb",
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    color: "#721c24",
    cursor: "pointer",
    fontSize: "18px",
    padding: "0",
    marginLeft: "10px",
  };

  return (
    <div style={errorStyle}>
      <span>{message}</span>
      {onClose && (
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

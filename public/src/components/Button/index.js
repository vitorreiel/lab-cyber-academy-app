import React from "react";
import "./styles.css";

const Button = ({ onClick, children, type = "secondary", className = '', ...otherProps }) => {
  return (
    <button
      type="button"
      className={`button ${type}-button ${className}`}
      onClick={onClick}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;

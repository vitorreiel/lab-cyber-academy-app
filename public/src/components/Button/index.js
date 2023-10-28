import React from "react";
import "./styles.css";

const Button = ({ onClick, children, type = "secondary", ...otherProps }) => {
  return (
    <button
      type="button"
      className={`button ${type}-button`}
      onClick={onClick}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;

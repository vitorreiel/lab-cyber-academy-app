import Icon from "./Icon";
import "./styles.css";

const buttonVariantStyles = {
  "default": "",
  "active": "container-button__active",
  "exit": "container-button__exit"    
};

const TerminalButton = ({ text, variant = "default", ...otherProps }) => {
  const buttonStyle = buttonVariantStyles[variant] || "";

  return (
    <button
      type="button"
      className={`container-button ${buttonStyle}`}
      {...otherProps}
    >
      <Icon /> <div>{text}</div>
    </button>
  );
};

export default TerminalButton;

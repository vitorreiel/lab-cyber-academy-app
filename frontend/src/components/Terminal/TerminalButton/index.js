import Icon from "./Icon";
import "./styles.css";

const TerminalButton = ({ text, isActive = false, ...otherProps }) => {
  return (
    <button
      type="button"
      className={`container-button ${isActive ? 'container-button__active' : ''}`}
      {...otherProps}
    >
      <Icon /> <div>{text}</div>
    </button>
  );
};

export default TerminalButton;

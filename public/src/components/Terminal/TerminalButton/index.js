import Icon from "./Icon";
import "./styles.css";

const TerminalButton = ({ text, ...otherProps }) => {
  return (
    <button type="button" className="container-button" {...otherProps}>
      <Icon /> <div>{text}</div>
    </button>
  );
};

export default TerminalButton;

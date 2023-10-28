import React from "react";
import TerminalButton from "../TerminalButton";
import "./styles.css";

const TerminalSidebar = ({ containers }) => {
  const [selectedContainer, setSelectedContainer] = React.useState(null);

  const executeCommand = (command) => {
    if (!selectedContainer) {
      window.writeCommand(command);

      return;
    }

    window.writeCommand('exit');

    setTimeout(() => {
      window.writeCommand(command);
    }, 500);
  };

  const handleContainerClick = (id, command) => {
    if (selectedContainer !== id) {
      setSelectedContainer(id);

      executeCommand(command);
    }
  };

  return (
    <div class="listing-containers" id="listing-containers">
      {
        containers.map(({ id, name, command }) => (
          <TerminalButton
            key={id}
            text={name}
            onClick={() => handleContainerClick(id, command)}
          />
        ))
      }
    </div>
  );
};

export default TerminalSidebar;
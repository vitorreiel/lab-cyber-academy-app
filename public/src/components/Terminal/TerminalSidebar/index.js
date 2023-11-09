import React from "react";
import TerminalButton from "../TerminalButton";
import "./styles.css";

const TerminalSidebar = ({ containers, forceTerminalRerender }) => {
  const [selectedContainer, setSelectedContainer] = React.useState(null);

  const executeCommand = ({ command, reopenTerminal }) => {
    if (!selectedContainer?.id) {
      window.writeCommand(command);

      return;
    }

    if (!reopenTerminal && !selectedContainer?.reopenTerminal) {
      window.writeCommand('exit');

      setTimeout(() => {
        window.writeCommand(command);
      }, 500);

      return;
    }

    localStorage.setItem('nextCommand', command);

    setTimeout(() => {
      forceTerminalRerender();
    }, 500);
  };

  const handleContainerClick = (container) => {
    if (selectedContainer?.id !== container.id) {
      setSelectedContainer(container);

      executeCommand(container);
    }
  };

  return (
    <div class="listing-containers" id="listing-containers">
      {
        containers.map((container) => (
          <TerminalButton
            key={container.id}
            text={container.name}
            onClick={() => handleContainerClick(container)}
          />
        ))
      }
    </div>
  );
};

export default TerminalSidebar;
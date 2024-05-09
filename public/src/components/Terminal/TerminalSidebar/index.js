import React from "react";
import { useLab } from "../../../hooks/useLab";
import { useRouter } from "../../../hooks/useRouter";
import TerminalButton from "../TerminalButton";
import "./styles.css";

const TerminalSidebar = ({ containers, forceTerminalRerender }) => {
  const { setLab } = useLab();
  const { setPage } = useRouter();

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

  const handleExitClick = () => {
    window.writeCommand('docker attach containernet');
  
    setTimeout(() => {
      window.writeCommand('exit');
  
      setTimeout(() => {
        setSelectedContainer(null);
        setLab({});
        setPage('home');
      }, 1000);
    }, 500);
  };

  return (
    <div className="listing-containers" id="listing-containers">
      {
        containers.map((container) => (
          <TerminalButton
            key={container.id}
            text={container.name}
            isActive={container.id === selectedContainer?.id}
            onClick={() => handleContainerClick(container)}
          />
        ))
      }

      <TerminalButton
        key="exit"
        text="Sair"
        isActive={false}
        onClick={handleExitClick}
      />
    </div>
  );
};

export default TerminalSidebar;
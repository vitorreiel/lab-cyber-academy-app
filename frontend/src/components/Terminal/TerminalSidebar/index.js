import React from "react";
import { useLab } from "../../../hooks/useLab";
import { useRouter } from "../../../hooks/useRouter";
import TerminalButton from "../TerminalButton";
import { sleep } from "../../../utils/sleep"
import "./styles.css";
import BaseModal from "../../Modal";
import Button from "../../Button";

const TerminalSidebar = ({ containers, forceTerminalRerender }) => {
  const { setLab } = useLab();
  const { setPage } = useRouter();

  const [exitModalOpen, setExitModalOpen] = React.useState(false);
  const [selectedContainer, setSelectedContainer] = React.useState(null);

  const reloadTerminal = () => {
    setTimeout(() => {
      forceTerminalRerender();
    }, 300);
  };

  const executeCommand = ({ command }) => {
    if (!selectedContainer?.id) {
      window.writeCommand(command);

      return;
    }

    localStorage.setItem('nextCommand', command);

    reloadTerminal();
  };

  const handleContainerClick = (container) => {
    if (selectedContainer?.id !== container.id) {
      setSelectedContainer(container);

      executeCommand(container);
    }
  };

  const handleExitClick = () => {
    setExitModalOpen(true);
  };

  const onExit = () => {
    console.log("[EXIT] - Exiting exec...");
    setExitModalOpen(false);
    console.log("[EXIT] - Reload terminal...");
    reloadTerminal();

    sleep(1000).then(() => {
      console.log("[EXIT] - Attaching container...");
      window.writeCommand('docker attach containernet');

      sleep(1000).then(() => {
        console.log("[EXIT] - Exiting container...");
        window.writeCommand('exit');

        setTimeout(() => {
          console.log("[EXIT] - Resetting state...");
          setSelectedContainer(null);
          setLab({});
          setPage('home');
        }, 1500);
      });
    });
  };

  return (
    <div className="listing-containers" id="listing-containers">
      {
        containers.map((container) => (
          <TerminalButton
            key={container.id}
            text={container.name}
            variant={container.id === selectedContainer?.id ? "active" : "default"}
            onClick={() => handleContainerClick(container)}
          />
        ))
      }

      <TerminalButton
        key="exit"
        text="Sair"
        variant="exit"
        onClick={handleExitClick}
      />

      {exitModalOpen && (
        <BaseModal
          title="Tem certeza?"
          isOpen={exitModalOpen}
          closeModal={() => setExitModalOpen(false)}
          FooterComponent={() => (
            <>
              <p className="modal-footer-description">Você realmente deseja iniciar esse cenário?</p>

              <div className="modal-footer-button">
                <Button type="destructive" onClick={onExit}>Sim</Button>
                <Button onClick={() => setExitModalOpen(false)}>Não</Button>
              </div>
            </>
          )}
        />
      )}
    </div>
  );
};

export default TerminalSidebar;

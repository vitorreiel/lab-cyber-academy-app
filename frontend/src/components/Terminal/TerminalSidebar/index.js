import React from "react";
import { useLab } from "../../../hooks/useLab";
import { useRouter } from "../../../hooks/useRouter";
import TerminalButton from "../TerminalButton";
import { sleep } from "../../../utils/sleep";
import BaseModal from "../../Modal";
import Button from "../../Button";
import "./styles.css";

const TerminalSidebar = ({ containers, forceTerminalRerender }) => {
  const { setLab } = useLab();
  const { setPage } = useRouter();

  const [exitModalOpen, setExitModalOpen] = React.useState(false);
  const [selectedContainer, setSelectedContainer] = React.useState(null);
  const [closingLoading, setClosingLoading] = React.useState(false);

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

    localStorage.setItem("nextCommand", command);

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
    setClosingLoading(false);
  };

  const onExit = () => {
    const MAX_RETRIES = 5;
    const BASE_DELAY = 500;
    let retryCount = 0;

    const attemptExit = () => {
      console.log(`\n[EXIT] - Attempting ${retryCount + 1} to exit container...`);
      console.log("[EXIT] - Exiting exec...");
      console.log("[EXIT] - Reload terminal...");
      setClosingLoading(true);

      reloadTerminal();

      const delayTime = BASE_DELAY * (retryCount + 1);

      return sleep(delayTime)
        .then(() => {
          console.log("[EXIT] - Attaching container...");
          window.writeCommand("docker attach containernet");
          return sleep(delayTime);
        })
        .then(() => {
          console.log("[EXIT] - Exiting container...");
          window.writeCommand("exit");
          return sleep(delayTime + BASE_DELAY);
        })
        .then(() => {
          console.log("[EXIT] - Resetting state...");
          setSelectedContainer(null);
          setLab({});
          setPage("home");
          return true;
        })
        .catch(error => {
          console.error(`[EXIT] - Attempt ${retryCount + 1} failed:`, error);
          return false;
        });
    };

    const tryNextAttempt = () => {
      if (retryCount >= MAX_RETRIES) return;

      attemptExit()
        .then(success => {
          if (!success) {
            retryCount++;
            tryNextAttempt();
          }
        });
    };

    tryNextAttempt();
  };

  return (
    <div className="listing-containers" id="listing-containers">
      {containers.map((container) => (
        <TerminalButton
          key={container.id}
          text={container.name}
          variant={
            container.id === selectedContainer?.id ? "active" : "default"
          }
          onClick={() => handleContainerClick(container)}
        />
      ))}

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
              <p className="modal-footer-description">
                Você realmente deseja iniciar esse cenário?
              </p>

              <div className="modal-footer-button">
                <Button
                  type="destructive"
                  onClick={onExit}
                  disabled={closingLoading}
                >
                  {closingLoading ? "Saindo..." : "Sim"}
                </Button>
                <Button
                  onClick={() => setExitModalOpen(false)}
                  disabled={closingLoading}
                >
                  Não
                </Button>
              </div>
            </>
          )}
        />
      )}
    </div>
  );
};

export default TerminalSidebar;

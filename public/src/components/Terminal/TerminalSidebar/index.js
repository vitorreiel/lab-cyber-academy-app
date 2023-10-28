import React from "react";
import TerminalButton from "../TerminalButton";
import "./styles.css";

const TerminalSidebar = ({ containers }) => {
  return (
    <div className="listing-containers" id="listing-containers">
      {
        containers.map(({ id, name, command }) => (
          <TerminalButton
            key={id}
            text={name}
            onClick={() => window.writeCommand(command)}
          />
        ))
      }
    </div>
  );
};

export default TerminalSidebar;

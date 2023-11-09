import React, { useState } from "react";
import TerminalSidebar from "../TerminalSidebar";
import TerminalInstance from "../TerminalInstance";
import "./styles.css";

const TerminalContainer = ({ containers = [] }) => {
  const [forceState, setForceUpdate] = useState();

  const forceTerminalRerender = () => {
    setForceUpdate(prevForceUpdate => !prevForceUpdate);
  };

  return (
    <div className="terminal-page-container">
      <div className="terminal-page-content">
        <TerminalSidebar containers={containers} forceTerminalRerender={forceTerminalRerender}  />

        <div id="terminal-container">
          <TerminalInstance key={forceState} />
        </div>
      </div>
    </div>
  );
};

export default TerminalContainer;

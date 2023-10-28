import React from "react";
import TerminalSidebar from "../TerminalSidebar";
import TerminalInstance from "../TerminalInstance";
import "./styles.css";

const TerminalContainer = ({ containers = [] }) => {
  return (
    <div className="terminal-page-container">
      <div className="terminal-page-content">
        <TerminalSidebar containers={containers} />

        <div id="terminal-container">
          <TerminalInstance />
        </div>
      </div>
    </div>
  );
};

export default TerminalContainer;

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalInstance = () => {
  const terminalRef = useRef(null);
  const webSocketRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal();
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);

    terminalRef.current = terminal;

    const initTerminal = () => {
      terminal.open(document.getElementById('terminal'));

      fitAddon.fit();

      const webSocket = new WebSocket(`ws://${window.location.host}/web-socket/ssh`);
      webSocketRef.current = webSocket;

      const sendSize = () => {
        const windowSize = { rows: terminal.rows, cols: terminal.cols };
        const blob = new Blob([JSON.stringify(windowSize)], { type: 'application/json' });
        webSocket.send(blob);
      };

      webSocket.onopen = sendSize;

      const resizeScreen = () => {
        fitAddon.fit();
        sendSize();
      };

      window.addEventListener('resize', resizeScreen, false);

      const attachAddon = new AttachAddon(webSocket);
      terminal.loadAddon(attachAddon);

      window.writeCommand = (command) => {
        webSocket.send(`${command}\r`);
      };
    };

    initTerminal();

    setTimeout(() => {
      const getNextCommand = localStorage.getItem('nextCommand') ?? '';

      if (Boolean(getNextCommand)) {
        window.writeCommand(getNextCommand);

        localStorage.clear();
      }
    }, 500);

    return () => {
      window.removeEventListener('resize', fitAddon.fit);
      window.writeCommand = null;
      webSocketRef.current.close();
    };
  }, []);

  return <div id="terminal" />;
};

export default TerminalInstance;

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalInstance = () => {
  const terminalRef = useRef(null);
  const webSocketRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal({
      fontSize: 17
    });
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);

    terminalRef.current = terminal;

    const initTerminal = () => {
      terminal.open(document.getElementById('terminal'));

      const xtermParent = document.querySelector('.terminal.xterm');
      if (xtermParent) xtermParent.style.zIndex = 0;

      const xtermViewport = document.querySelector('.xterm-viewport');
      xtermViewport.style.borderRadius = '3px';
      const xtermScreen = document.querySelector('.xterm-screen');
      xtermScreen.style.height = '80vh';
      const xtermTextLayer = document.querySelector('.xterm-text-layer');
      xtermTextLayer.style.paddingLeft = '6px';
      xtermTextLayer.style.borderRadius = '3px';
      const xtermCursorLayer = document.querySelector('.xterm-cursor-layer');
      xtermCursorLayer.style.paddingLeft = '10px';

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

        localStorage.removeItem('nextCommand');
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

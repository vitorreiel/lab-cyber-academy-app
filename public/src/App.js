import './App.css';

import Header from './components/Header';
import TerminalContainer from './components/Terminal/TerminalContainer';

const CONTAINERS_LIST = [
  {
    id: 1,
    name: "Containernet",
    command: "pwd"
  },
  {
    id: 2,
    name: "Suporte",
    command: "pwd"
  },
  {
    id: 3,
    name: "Internet",
    command: "pwd"
  },
  {
    id: 4,
    name: "Server Web",
    command: "pwd"
  },
  {
    id: 5,
    name: "Server Samba",
    command: "pwd"
  },
  {
    id: 6,
    name: "Roteador",
    command: "pwd"
  },
  {
    id: 7,
    name: "Joyce",
    command: "pwd"
  },
  {
    id: 8,
    name: "Henrique",
    command: "pwd"
  },
  {
    id: 9,
    name: "Gabriele",
    command: "pwd"
  },
  {
    id: 10,
    name: "João",
    command: "pwd"
  }
];

function App() {
  return (
    <main>
      <Header />

      <TerminalContainer
        containers={CONTAINERS_LIST}
      />
    </main>
  );
}

export default App;

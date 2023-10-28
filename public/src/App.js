import './App.css';

import Header from './components/Header';
import TerminalContainer from './components/Terminal/TerminalContainer';

const CONTAINERS_LIST = [
  {
    id: 1,
    name: "Containernet",
    command: "docker exec -it containernet bash"
  },
  {
    id: 2,
    name: "Suporte",
    command: "docker exec -it mn.suporte bash"
  },
  {
    id: 3,
    name: "Internet",
    command: "docker exec -it mn.internet bash"
  },
  {
    id: 4,
    name: "Server Web",
    command: "docker exec -it mn.servWeb bash"
  },
  {
    id: 5,
    name: "Server Samba",
    command: "docker exec -it mn.servSamba bash"
  },
  {
    id: 6,
    name: "User Gustavo",
    command: "docker exec -it mn.gustavo bash"
  },
  {
    id: 7,
    name: "User Joyce",
    command: "docker exec -it mn.joyce bash"
  },
  {
    id: 8,
    name: "User Henrique",
    command: "docker exec -it mn.henrique bash"
  },
  {
    id: 9,
    name: "User Gabriele",
    command: "docker exec -it mn.gabriele bash"
  },
  {
    id: 10,
    name: "User João",
    command: "docker exec -it mn.joao bash"
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

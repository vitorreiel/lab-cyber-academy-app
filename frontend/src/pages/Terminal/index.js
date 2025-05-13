import Header from '../../components/Header';
import TerminalContainer from '../../components/Terminal/TerminalContainer';
import { useLab } from '../../hooks/useLab';

const CONTAINERS_LIST_1 = [
  {
    id: 1,
    name: "Containernet",
    command: "clear && docker attach containernet\r"
  },
  {
    id: 2,
    name: "Suporte",
    command: "clear && docker exec -it mn.suporte bash"
  },
  {
    id: 3,
    name: "Internet",
    command: "clear && docker exec -it mn.internet bash"
  },
  {
    id: 4,
    name: "Server Web",
    command: "clear && docker exec -it mn.servWeb bash"
  },
  {
    id: 5,
    name: "Server Samba",
    command: "clear && docker exec -it mn.servSamba bash"
  },
  {
    id: 6,
    name: "User Gustavo",
    command: "clear && docker exec -it mn.gustavo bash"
  },
  {
    id: 7,
    name: "User Joyce",
    command: "clear && docker exec -it mn.joyce bash"
  },
  {
    id: 8,
    name: "User Henrique",
    command: "clear && docker exec -it mn.henrique bash"
  },
  {
    id: 9,
    name: "User Gabriele",
    command: "clear && docker exec -it mn.gabriele bash"
  },
  {
    id: 10,
    name: "User João",
    command: "clear && docker exec -it mn.joao bash"
  }
];

const CONTAINERS_LIST_2 = [
  {
    id: 1,
    name: "Containernet",
    command: "clear && docker attach containernet\r"
  },
  {
    id: 2,
    name: "Suporte",
    command: "clear && docker exec -it mn.suporte bash"
  },
  {
    id: 3,
    name: "Internet",
    command: "clear && docker exec -it mn.internet bash"
  },
  {
    id: 4,
    name: "Server Web",
    command: "clear && docker exec -it mn.servWeb bash"
  },
  {
    id: 5,
    name: "Server Samba",
    command: "clear && docker exec -it mn.servSamba bash"
  },
  {
    id: 6,
    name: "User Andreia",
    command: "clear && docker exec -it mn.andreia bash"
  },
  {
    id: 7,
    name: "User Lohan",
    command: "clear && docker exec -it mn.lohan bash"
  },
  {
    id: 8,
    name: "User Sophia",
    command: "clear && docker exec -it mn.sophia bash"
  },
  {
    id: 9,
    name: "User Saulo",
    command: "clear && docker exec -it mn.saulo bash"
  },
  {
    id: 10,
    name: "User João",
    command: "clear && docker exec -it mn.joao bash"
  }
];

// Utilize o padrão de código abaixo para adicionar novos cenários:
// const CONTAINERS_LIST_3 = [
//   {
//     id: 1,
//     name: "Containernet",
//     command: "clear && docker attach containernet\r"
//   },
//   {
//     id: 2,
//     name: "Suporte",
//     command: "clear && docker exec -it mn.suporte bash"
//   },
//   {
//     id: 3,
//     name: "Internet",
//     command: "clear && docker exec -it mn.internet bash"
//   }
// ];

function Terminal() {
  const {lab} = useLab()
  const getContainers = () => {
    if (lab.id === "01"){
      return CONTAINERS_LIST_1
    }
    if (lab.id === "02"){
      return CONTAINERS_LIST_2
    }
    // Utilize o padrão de código abaixo para adicionar novos cenários:
    // if (lab.id === "03"){
    //   return CONTAINERS_LIST_3
    // }
    return []
  }

  return (
    <>
      <Header />

      <TerminalContainer containers={getContainers()} />
    </>
  );
}

export default Terminal;

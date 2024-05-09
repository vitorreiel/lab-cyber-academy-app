import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Header from '../../components/Header';
import LabCard from '../../components/Lab/LabCard';
import { useRouter } from '../../hooks/useRouter';
import { useLab } from '../../hooks/useLab';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import './styles.css';
import Button from '../../components/Button';

const LABS_LIST = [
  {
    name: 'Laboratório 01',
    description: 'Ênfase em defesa',
    details: 'Esse laboratório utiliza o cenário de Cibersegurança, com o uso da ferramenta CyRM um tipo de Cyber Range, desenvolvido para simular um cenário realista de ataque cibérnetico e preparar o usuário para mitiga-lo, através de práticas guiadas por um roteiro de estudo.',
    id: '01'
  },
  {
    name: 'Laboratório 02',
    description: 'Ênfase em ataque',
    details: 'Esse laboratório utiliza o cenário de Cibersegurança com o uso da ferramenta CyRM-Attack, um tipo de Cyber Range desenvolvido para simular um cenário realista, com o intuito de para preparar o usuário e fazê-lo compreender como funciona um breve cenário de ataque cibérnetico, através de práticas guiadas por um roteiro de estudo.',
    id: '02'
  }
]

function Home() {
  const { setPage } = useRouter();
  const { getLabStatus, setLab, lab } = useLab();

  const [helpModalData, setHelpModalData] = useState(null);
  const [startLabData, setStartLabData] = useState(null);

  const labCreationError = () => {
    alert('Erro ao criar o laboratório, por favor, fale com o suporte e tente novamente mais tarde.');

    setLab(null);
    setPage('home');
  };

  useEffect(() => {
    if (getLabStatus() === 'LOADING') {
      const webSocket = new WebSocket(`ws://${window.location.host}/web-socket/ssh`);

      webSocket.onopen = () => {
        webSocket.send(JSON.stringify({ laboratory: lab?.id }));
      };

      webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (String(data?.laboratory) === String(lab?.id)) {
            setPage('terminal');
          } else {
            labCreationError();
          }
        } catch (error) {}
      };

      webSocket.onerror = () => {
        labCreationError();
      }
    }
  }, [getLabStatus]);

  const startLab = () => {
    setLab(startLabData);
    setStartLabData(null);
  };

  const renderSelectLab = () => {
    return (
      <div className="home-page-container">
        <div className="home-page-content">
          <Card title="Cenários disponíveis:" />

          <div className="labs-container">
            {
              LABS_LIST.map((labData, index) => (
                <LabCard
                  key={index}
                  labData={labData}
                  showDetails={setHelpModalData}
                  showStartLab={setStartLabData}
                />
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  const renderLoadingLab = () => {
    return (
      <div className="home-page-container">
        <div className="home-page-content">
          <Card title="Criando cenário..." />

          <Card>
            <Loader />
          </Card>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />

      {
        getLabStatus() === 'OFFLINE'
          ? renderSelectLab()
          : renderLoadingLab()
      }

      <Modal
        title={helpModalData?.name}
        description={helpModalData?.details}
        closeModal={() => setHelpModalData(null)}
        isOpen={!!helpModalData}
      />

      <Modal
        title={startLabData?.name}
        isOpen={!!startLabData}
        closeModal={() => setStartLabData(null)}
        FooterComponent={() => (
          <>
            <p className="modal-footer-description">Você realmente deseja iniciar esse cenário?</p>

            <div className="modal-footer-button">
              <Button type="primary" onClick={startLab}>Sim</Button>
              <Button onClick={() => setStartLabData(null)}>Não</Button>
            </div>
          </>
        )}
      />
    </>
  );
}

export default Home;

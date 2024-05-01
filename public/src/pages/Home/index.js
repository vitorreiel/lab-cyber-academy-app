import { useEffect } from 'react';
import Card from '../../components/Card';
import Header from '../../components/Header';
import LabCard from '../../components/Lab/LabCard';
import { useRouter } from '../../hooks/useRouter';
import { useLab } from '../../hooks/useLab';
import './styles.css';
import Loader from '../../components/Loader';

const LABS_LIST = [
  {
    name: 'Laboratório 01',
    description: 'Ênfase em defesa',
    details: 'Esse laboratório utiliza o cenário de Cibersegurança, com o uso da ferramenta CyRM um tipo de Cyber Range, desenvolvido para simular um cenário realista de ataque cibérnetico e preparar o usuário para mitiga-lo, através de práticas guiadas por um roteiro de estudo.'
  },
  {
    name: 'Laboratório 02',
    description: 'Ênfase em ataque',
    details: 'Lorem ipsum'
  }
]

function Home() {
  const { setPage } = useRouter();
  const { getLabStatus } = useLab();

  useEffect(() => {
    if (getLabStatus() === 'LOADING') {
      setTimeout(() => {
        setPage('terminal');
      }, 2000);
    }
  }, [getLabStatus]);

  const renderSelectLab = () => {
    return (
      <div className="home-page-container">
        <div className="home-page-content">
          <Card title="Cenários disponíveis:" />

          <div className="labs-container">
            {
              LABS_LIST.map((labData, index) => (
                <LabCard key={index} labData={labData} />
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
    </>
  );
}

export default Home;

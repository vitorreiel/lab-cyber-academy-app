import Button from "../../Button";
import Card from "../../Card";
import { useLab } from '../../../hooks/useLab';
import './styles.css';

const LabCard = ({ labData = {} }) => {
  const { setLab } = useLab();

  const showDetails = () => {
    alert(labData.details);
  };

  const startLab = () => {
    const confirmation = window.confirm(`Você realmente deseja iniciar o cenário ${labData.name}?`);

    if (confirmation) {
      setLab(labData);
    }
  };

  return (
    <Card title={labData.name}>
      <div className="lab-content">
        <div className="lab-content-description">
          {labData.description}

          <button
            type="button"
            className="lab-content-description__details"
            onClick={showDetails}
          >?</button>
        </div>

        <Button
          type="primary"
          className="lab-content-start-button"
          onClick={startLab}
        >
          Iniciar
        </Button>
      </div>
    </Card>
  )
};

export default LabCard;

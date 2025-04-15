import Button from "../../Button";
import Card from "../../Card";
import './styles.css';

const LabCard = ({ showDetails = () => {}, showStartLab = () => {}, labData = {} }) => {

  const _showDetails = () => {
    showDetails(labData);
  };

  const _showStartLab = () => {
    showStartLab(labData);
  };

  return (
    <Card title={labData.name}>
      <div className="lab-content">
        <div className="lab-content-description">
          {labData.description}

          <button
            type="button"
            className="lab-content-description__details"
            onClick={_showDetails}
          >?</button>
        </div>

        <Button
          type="primary"
          className="lab-content-start-button"
          onClick={_showStartLab}
        >
          Iniciar
        </Button>
      </div>
    </Card>
  );
};

export default LabCard;

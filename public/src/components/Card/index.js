import './styles.css';

const Card = ({ title, children }) => {
  return (
    <div className="card">
      {
        title && (
          <div className="card-title">{title}</div>
        )
      }

      {
        children && (
          <div className="card-content">{children}</div>
        )
      }
    </div>
  )
};

export default Card;

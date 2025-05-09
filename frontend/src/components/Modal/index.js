import Modal from 'react-modal';

const modalContainer = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    padding: '20px',
    width: '100%',
    zIndex: 999999,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    marginBottom: '20px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
  },
};

Modal.setAppElement('#root');

function BaseModal({
  title,
  description,
  isOpen,
  closeModal,
  FooterComponent
}) {
  return (
    <Modal
      isOpen={isOpen}
      style={modalContainer}
    >
      <div>
        <h2 style={modalContainer.title}>{title}</h2>
        {
          closeModal && (
            <button style={modalContainer.closeButton} onClick={closeModal}>x</button>
          )
        }
      </div>

      <p style={modalContainer.description}>{description}</p>

      {
        FooterComponent && <FooterComponent />
      }
    </Modal>
  )
}

export default BaseModal;

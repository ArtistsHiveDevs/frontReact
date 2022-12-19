import "./index.scss";
import { Button, Modal } from "react-bootstrap";

const ModalCardInfo = (props: any) => {
  const { information } = props;
  return (
    <Modal
      className="modal-container"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          {information.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{information.description}</Modal.Body>
      <Modal.Footer className="card-buttons-container">
        {/* <Button onClick={props.onHide}>Cerrar</Button> */}
        <a className="card-link" href={void 0}>
          Card Link
        </a>
        <a className="card-link" href={void 0}>
          Another Link
        </a>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCardInfo;

import "./GenericModal.scss";
import { Button, Modal } from "react-bootstrap";

const GenericModal = (props: any) => {
  const { title, body, buttons, links } = props;
  return (
    <Modal
      className="modal-container"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {title && (
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="modal-title"
          >
            {title}
          </Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body className="text-modal-info">{body}</Modal.Body>
      {(buttons || links) && (
        <Modal.Footer className="card-buttons-container">
          {buttons?.map((button: any, idx: number) => {
            return (
              <Button
                key={`button-modal-${idx}`}
                onClick={() => props.onHide(`b${button.label}`)}
              >
                {button.label}
              </Button>
            );
          })}

          {links?.map((link: any, idx: number) => {
            return (
              <a
                className="card-link"
                key={`link-modal-${idx}`}
                onClick={() => props.onHide(`l${link.label}`)}
                href={link?.url || void 0}
              >
                {link.label}
              </a>
            );
          })}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default GenericModal;

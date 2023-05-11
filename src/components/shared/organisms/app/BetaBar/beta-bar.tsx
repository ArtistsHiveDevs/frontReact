import {
  Button,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import "./beta-bar.scss";
import { useState } from "react";

const BetaBarComponent: React.FC = () => {
  const email = "support.it@artistshive.com";

  const [hideSection, updateHideSection] = useState(false);

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>{email}</strong> es nuestro correo.
    </Tooltip>
  );
  return (
    !hideSection && (
      <Container className="container-beta">
        <Row>
          <div className="beta-disclaimer">
            <strong
              className="disclaimer-value"
              onClick={(e) => updateHideSection(true)}
            >
              X
            </strong>
          </div>
        </Row>
        <Row>
          <Col className="beta-text-col">
            <Row className="beta-label-text">
              Estás viendo una versión de prueba de nuestra plataforma.
              Esperamos que te guste, puedes contactarnos en el botón que está a
              continuación.
            </Row>
          </Col>
          <Col sm={2} className="beta-button-col">
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <Button className="button-styles" href={`mailto:${email}`}>
                Contáctanos
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default BetaBarComponent;

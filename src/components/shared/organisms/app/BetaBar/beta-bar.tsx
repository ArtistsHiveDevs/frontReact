import { useState } from "react";
import {
  Button,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useI18n } from "~/common/utils";
import "./beta-bar.scss";

const TRANSLATION_BASE_BETA_BAR = "app.appbase.betabar";

const BetaBarComponent: React.FC = () => {
  const { translateText } = useI18n();

  const translate = (text: string) => {
    return translateText(`${TRANSLATION_BASE_BETA_BAR}.${text}`);
  };
  const email = "support.it@artistshive.com";

  const [hideSection, updateHideSection] = useState(false);

  const tooltip = (
    <Tooltip id="tooltip">
      {translate("our_email_is")}
      <strong>{email}</strong>.
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
            <Row className="beta-label-text">{translate("disclaimer")}</Row>
          </Col>
          <Col sm={2} className="beta-button-col">
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <Button className="button-styles" href={`mailto:${email}`}>
                {translate("contact_us")}
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default BetaBarComponent;

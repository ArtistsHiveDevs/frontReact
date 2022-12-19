import React from "react";
import { Card } from "react-bootstrap";
import { AligmentVerifiedMark } from "~/constants";
import ModalCardInfo from "~/components/shared/Modals/ModalCardInfo";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import "./index.scss";

const NewEntityCard = (props: any) => {
  const { data, idx, params } = props;
  const [modalDetailShow, setModalDetailShow] = React.useState(false);
  const showModalDetail = () => setModalDetailShow(true);

  return (
    <>
      <Card key={idx} className="new-entity-card" onClick={showModalDetail}>
        {!params?.hidePhoto && (
          <>
            {data?.photo && (
              <div className="container-img-card">
                <Card.Img
                  className="img-card"
                  src={data.photo}
                  variant="top"
                ></Card.Img>
                <Card.ImgOverlay>
                  <div className="card-name-section">
                    <p className="card-title-label">
                      <span className="verified-comp">
                        <VerifiedArtist
                          aligment={AligmentVerifiedMark.LEFT}
                          verifiedStatus={data?.verified_status}
                        />
                      </span>
                      <span>{data.name}</span>
                    </p>
                    <p>{data.subtitle}</p>
                  </div>
                </Card.ImgOverlay>
              </div>
            )}
          </>
        )}
      </Card>
      <ModalCardInfo
        information={data}
        show={modalDetailShow}
        onHide={() => setModalDetailShow(false)}
      />
    </>
  );
};

export default NewEntityCard;

import React from "react";
import { Card } from "react-bootstrap";
import { AligmentVerifiedMark } from "~/constants";
import ModalCardInfo from "~/components/shared/Modals/ModalCardInfo";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import "./index.scss";
import DynamicIcons from "~/components/shared/DynamicIcons";

const NewEntityCard = (props: any) => {
  const { data, idx, params, callbacks } = props;
  const [modalDetailShow, setModalDetailShow] = React.useState(false);

  function onClickCardHandler() {
    if (callbacks?.onClickCard) {
      callbacks.onClickCard(data);
    } else {
      showModalDetail();
    }
  }
  const showModalDetail = () => setModalDetailShow(true);

  const captureCloseValue = (value: any) => {
    setModalDetailShow(false);
  };

  const links = [{ label: "LINK" }, { label: "ANOTHER LINK" }];

  const elementCardInfo = data.cardInfo;

  return (
    <>
      <Card
        key={idx}
        className="new-entity-card"
        onClick={() => onClickCardHandler()}
      >
        {!params?.hidePhoto && (
          <>
            {data?.photo && (
              <>
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
                        <span>{elementCardInfo?.title || data?.name}</span>
                      </p>
                    </div>
                  </Card.ImgOverlay>
                  {data.place && (
                    <div className="card-footer-place">
                      {data.timetable__initial_date && (
                        <p>
                          <span>
                            <DynamicIcons
                              iconName="FaRegCalendarAlt"
                              size={20}
                              color="#7a260a"
                            />
                          </span>
                          <span>
                            <>{data.timetable__initial_date}</>
                          </span>
                        </p>
                      )}
                      <p>
                        <span>
                          <DynamicIcons
                            iconName="FaMapMarkerAlt"
                            size={20}
                            color="#7a260a"
                          />
                        </span>
                        <span>
                          <>
                            {data.place.Nombre} <br /> {data.place.Dirección}
                            <br /> {data.place.Ciudad}
                          </>
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </Card>
      <ModalCardInfo
        title={data.name}
        body={data.description}
        links={links}
        show={modalDetailShow}
        onHide={(event: any) => captureCloseValue(event)}
      />
    </>
  );
};

export default NewEntityCard;

import React from "react";
import { Card } from "react-bootstrap";
import DynamicIcons from "~/components/shared/DynamicIcons";
import GenericModal from "~/components/shared/molecules/general/Modals/ModalCardInfo/GenericModal";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { AligmentVerifiedMark, formatDateInMomentType } from "~/constants";
import "./index.scss";

const NewEntityCard = (props: any) => {
  const { data, idx, params, callbacks, printDayOfWeek } = props;
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

  const photoURL = data?.profile_pic || data?.photo;

  return (
    <>
      <Card
        key={idx}
        className="new-entity-card"
        onClick={() => onClickCardHandler()}
      >
        {!params?.hidePhoto && (
          <>
            {photoURL && (
              <>
                <div className="container-img-card">
                  <Card.Img
                    className="img-card"
                    src={photoURL}
                    variant="top"
                  ></Card.Img>
                  <Card.ImgOverlay>
                    {data.timetable__initial_date && (
                      <div className="card-date-section">
                        <p className="card-date-number">
                          {formatDateInMomentType(
                            data.timetable__initial_date,
                            "DD"
                          )}
                        </p>
                        <p className="card-date-label">
                          {formatDateInMomentType(
                            data.timetable__initial_date,
                            !!printDayOfWeek ? "ddd" : "MMM"
                          )}
                        </p>
                      </div>
                    )}
                    <div className="card-name-section">
                      <p className="card-title-label">
                        <span className="verified-comp">
                          <VerifiedArtist
                            aligment={AligmentVerifiedMark.LEFT}
                            verifiedStatus={data?.verified_status}
                          />
                        </span>
                        <span className="title-card-span">
                          {elementCardInfo?.title || data?.name}
                        </span>
                      </p>
                    </div>
                  </Card.ImgOverlay>
                  {data.place && (
                    <div className="card-footer-place">
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
                            {data.place.name} <br /> {data.place.address}
                            <br /> {data.place.city}
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
      <GenericModal
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

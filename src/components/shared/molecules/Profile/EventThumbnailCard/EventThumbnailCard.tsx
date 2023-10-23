import { Card } from "react-bootstrap";
import Flag from "react-world-flags";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { formatDateInMomentType } from "~/constants";
import { EventModel } from "~/models/domain/event/event.model";
import "./EventThumbnailCard.scss";

export const EventThumbnailCard = (props: any) => {
  const { elementData, footer, styles, callbacks } = props;

  const event = elementData as EventModel;

  console.log("$$$$$  EV ", event);

  const { profile_pic, name, subtitle, verified_status } = elementData || {};

  function onClickCardHandler() {
    if (callbacks?.onClickCard) {
      callbacks.onClickCard(elementData);
    }
  }

  const flags = {
    Colombia: "co",
    España: "es",
    Inglaterra: "GB-ENG",
  };

  const confirmationStatuses = [
    "DRAFT",
    "CREATED",
    "UNDER_REVIEW",
    "RETURNED",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
  ];

  const confirmationStatus =
    confirmationStatuses[
      Math.floor(Math.random() * confirmationStatuses.length)
    ];

  const eventConfirmStatusColor = (function () {
    switch (confirmationStatus) {
      case "CREATED":
        return "created";
      case "UNDER_REVIEW":
        return "under-review";
      case "RETURNED":
        return "in-process";
      case "APPROVED":
        return "confirmed";
      case "REJECTED":
      case "CANCELLED":
        return "rejected";
      default:
        return "";
    }
  })();

  return (
    <div className="profile-thumbnail-card" onClick={onClickCardHandler}>
      <div className="profile-header">
        <Card>
          <div className="container-img-card">
            <Card.Img className="img-card" src={profile_pic}></Card.Img>
            <Card.ImgOverlay>
              {
                <div className="card-date-section">
                  <p className="card-date-number">
                    {formatDateInMomentType(
                      event.timetable__initial_date,
                      "DD"
                    )}
                  </p>
                  <p className="card-date-label">
                    {formatDateInMomentType(
                      event.timetable__initial_date,
                      "ddd"
                    )}
                  </p>
                </div>
              }
            </Card.ImgOverlay>
          </div>
        </Card>
        <div className="header-title d-grid align-items-bottom">
          <div className="artist-name">
            <h4>
              {name} <VerifiedArtist verifiedStatus={verified_status} />
            </h4>
          </div>
          <div className="artist-name">
            <p>{subtitle}</p>
            {!!event.place && (
              <p>
                {event.place.name} <br />
                {event.place.address} <br />
                {event.place.city} <br />
                {event.place.country}{" "}
                <Flag
                  code={flags[event.place.country as keyof typeof flags]}
                  height="15"
                  style={{ border: "1px solid #999" }}
                />
              </p>
            )}
            <p>
              status: {confirmationStatus}
              <span
                className={[
                  "event-confirm-status",
                  eventConfirmStatusColor,
                ].join(" ")}
              ></span>
            </p>
          </div>
        </div>
      </div>
      {footer && (
        <div className="profile-thumbnail-card-footer">{footer()}</div>
      )}
    </div>
  );
};

import { Moment } from "moment";
import { Image } from "react-bootstrap";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";
import { PlaceModel } from "~/models/domain/place/place.model";
import "./CalendarSimpleEvent.scss";

export interface EventParams {
  name: string;
  title?: string;
  subtitle?: string;
  datetime: Moment;
  picture?: string;
  place?: PlaceModel;
}
export const CalendarSimpleEvent = (props: {
  eventInfo: EventParams;
  requireSession?: boolean;
  onClickHandler?: Function;
}) => {
  const { eventInfo, requireSession, onClickHandler } = props;

  function clickHandler(eventSource: EventParams) {
    if (onClickHandler) {
      onClickHandler(eventSource);
    }
  }

  return (
    <RequireAuthComponent
      key={`calendar-${eventInfo.name}`}
      requiredSession={requireSession}
    >
      <div
        className="calendar-event-container"
        onClick={() => clickHandler(eventInfo)}
      >
        <div className="calendar-event-date">
          <span className="day">
            {eventInfo.datetime.format("dddd").substring(0, 3)}{" "}
            {eventInfo.datetime.date()}
          </span>
          <span className="hour">{eventInfo.datetime.format("HH:mm")}</span>
        </div>
        <div className="calendar-event-content">
          <p className="calendar-event-title">{eventInfo.name}</p>
          {eventInfo.place && (
            <p className="calendar-event-place">
              {eventInfo.place.address}
              <br />
              {eventInfo.place.city}, {eventInfo.place.country}
            </p>
          )}
        </div>
        {eventInfo.picture && (
          <div className="calendar-event-picture-container">
            <Image className="calendar-event-picture" src={eventInfo.picture} />
          </div>
        )}
      </div>
    </RequireAuthComponent>
  );
};

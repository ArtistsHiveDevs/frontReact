import { Moment } from "moment";
import { Image } from "react-bootstrap";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";
import "./CalendarSimpleEvent.scss";

export interface EventParams {
  name: string;
  title?: string;
  subtitle?: string;
  datetime: Moment;
  picture?: string;
}
export const CalendarSimpleEvent = (props: {
  info: EventParams;
  requireSession?: boolean;
  onClickHandler?: Function;
}) => {
  const { info, requireSession, onClickHandler } = props;

  function clickHandler(eventSource: EventParams) {
    if (onClickHandler) {
      onClickHandler(eventSource);
    }
  }
  return (
    <RequireAuthComponent
      key={`calendar-${info.name}`}
      requiredSession={requireSession}
    >
      <div
        className="calendar-event-container"
        onClick={() => clickHandler(info)}
      >
        <div className="calendar-event-date">
          <span className="day">
            {info.datetime.format("dddd").substring(0, 3)}{" "}
            {info.datetime.date()}
          </span>
          <span className="hour">{info.datetime.format("HH:mm")}</span>
        </div>
        <div className="calendar-event-content">{info.name}</div>
        {info.picture && (
          <div className="calendar-event-picture-container">
            <Image className="calendar-event-picture" src={info.picture} />
          </div>
        )}
      </div>
    </RequireAuthComponent>
  );
};

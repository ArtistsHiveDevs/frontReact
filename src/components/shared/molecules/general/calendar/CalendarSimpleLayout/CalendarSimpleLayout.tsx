import "./CalendarSimpleLayout.scss";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";
import { Moment } from "moment";
import {
  CalendarSimpleEvent,
  EventParams,
} from "~/components/shared/atoms/calendar/CalendarSimpleEvent/CalendarSimpleEvent";

export const CalendarSimpleLayout = (props: {
  events: EventParams[];
  onClickHandler?: Function;
  requireSession?: boolean;
}) => {
  const { events, onClickHandler, requireSession } = props;

  function clickHandler(eventSource: any) {
    if (onClickHandler) {
      onClickHandler(eventSource);
    }
  }
  return (
    <RequireAuthComponent
      key={`calendar-${name}`}
      requiredSession={requireSession}
    >
      {events.map(
        (event: EventParams, index: number, allEvents: EventParams[]) => {
          const previousIndex = index - 1;
          const previousMonth =
            index >= 0 && index < allEvents.length
              ? allEvents[previousIndex]?.datetime.month()
              : -1;
          const currentMonth = event?.datetime.month();

          let monthTitle = undefined;
          if (previousMonth !== currentMonth) {
            monthTitle = (
              <h3 className="month-title">{event?.datetime.format("MMMM")}</h3>
            );
          }
          return (
            <div key={`${event.name}-${event?.datetime}`}>
              {monthTitle}
              <CalendarSimpleEvent info={event} onClickHandler={clickHandler} />
            </div>
          );
        }
      )}
    </RequireAuthComponent>
  );
};

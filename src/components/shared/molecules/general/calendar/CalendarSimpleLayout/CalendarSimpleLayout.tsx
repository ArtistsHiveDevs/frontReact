import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { CalendarSimpleEvent } from '~/components/shared/atoms/calendar/CalendarSimpleEvent/CalendarSimpleEvent';
import { EventModel } from '~/models/domain/event/event.model';
import './CalendarSimpleLayout.scss';

export const CalendarSimpleLayout = (props: {
  events: EventModel[];
  options: { [optionName: string]: any };
  onClickHandler?: Function;
  requireSession?: boolean;
}) => {
  const { events, onClickHandler, requireSession, options } = props;

  function clickHandler(eventSource: any) {
    if (onClickHandler) {
      onClickHandler(eventSource);
    }
  }

  return (
    <RequireAuthComponent key={`calendar-${name}`} requiredSession={requireSession}>
      {events.length === 0 && 'No se encontraron eventos'}
      {events.map((event: EventModel, index: number, allEvents: EventModel[]) => {
        const previousIndex = index - 1;
        const previousMonth =
          index >= 0 && index < allEvents.length ? allEvents[previousIndex]?.timetable__initial_date.month() : -1;
        const currentMonth = event?.timetable__initial_date.month();

        let monthTitle = undefined;
        if (previousMonth !== currentMonth) {
          monthTitle = <h3 className="month-title">{event?.timetable__initial_date.format('MMMM')}</h3>;
        }
        return (
          <div key={`${event.name}-ev-${index}`}>
            {monthTitle}
            <CalendarSimpleEvent eventInfo={event} onClickHandler={clickHandler} options={options} />
          </div>
        );
      })}
    </RequireAuthComponent>
  );
};

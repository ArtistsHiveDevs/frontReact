import { Moment } from 'moment';
import { Image } from 'react-bootstrap';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import './CalendarSimpleEvent.scss';

export interface EventParams {
  name: string;
  title?: string;
  subtitle?: string;
  datetime: Moment;
  picture?: string;
  place?: PlaceModel;
}

export const CalendarSimpleEvent = (props: {
  eventInfo: EventModel;
  options: { [optionName: string]: any };
  requireSession?: boolean;
  onClickHandler?: Function;
  resourceEntity: any;
}) => {
  const { eventInfo, requireSession, onClickHandler, options, resourceEntity } = props;

  function clickHandler(eventSource: EventModel) {
    if (onClickHandler) {
      onClickHandler(eventSource);
    }
  }

  return (
    <RequireAuthComponent
      resourceEntity={resourceEntity}
      key={`calendar-${eventInfo.name}`}
      requiredSession={requireSession}
    >
      <div className="calendar-event-container" onClick={() => clickHandler(eventInfo)}>
        <div className="calendar-event-date">
          <span className="day">
            {eventInfo.timetable__initial_date.format('dddd').substring(0, 3)}{' '}
            {eventInfo.timetable__initial_date.date()}
          </span>
          <span className="hour">{eventInfo.timetable__initial_date.format('HH:mm')}</span>
        </div>
        <div className="calendar-event-content">
          <p className="calendar-event-title">
            <strong>{eventInfo.name}</strong>
          </p>
          {!options?.hidePlace && eventInfo.place && (
            <p className="calendar-event-place">
              <strong>{eventInfo.place.name}</strong>
              <br />
              {eventInfo.place.address}
              <br />
              {eventInfo.place.cityWithCountry}
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

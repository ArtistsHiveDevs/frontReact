import Flag from 'react-world-flags';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import { EventModel } from '~/models/domain/event/event.model';
import './EventThumbnailCard.scss';

export const EventThumbnailCard = (props: any) => {
  const { elementData, footer, styles, callbacks } = props;

  const event = elementData as EventModel;

  const { profile_pic, name, subtitle, verified_status } = elementData || {};

  function onClickCardHandler() {
    if (callbacks?.onClickCard) {
      callbacks.onClickCard(elementData);
    }
  }

  const flags = {
    Colombia: 'co',
    España: 'es',
    Inglaterra: 'GB-ENG',
  };

  const eventConfirmStatusColor = (function () {
    switch (event.confirmation_status) {
      case 'DRAFT':
        return 'draft';
      case 'CREATED':
        return 'created';
      case 'UNDER_REVIEW':
        return 'under-review';
      case 'RETURNED':
        return 'in-process';
      case 'APPROVED':
        return 'confirmed';
      case 'REJECTED':
      case 'CANCELLED':
        return 'rejected';
      default:
        return 'draft';
    }
  })();

  // const initialTime = moment(event.timetable__initial_date);
  // const time = event.initial_time;
  // const hour = Math.floor(time / 100);
  // const minutes = time - hour * 100;
  const initialTime = event.timetable__initial_date;
  // .set('hour', hour);
  // initialTime.set('minutes', minutes);
  // console.log('%%%%%   ', event, initialTime, time, hour, minutes);

  return (
    <div className={['profile-thumbnail-card', eventConfirmStatusColor].join(' ')} onClick={onClickCardHandler}>
      <div className="profile-header">
        <div className="container-img-card-ev">
          <div className="card-date-section">
            <p className="card-date-month">{event.timetable__initial_date.format('ddd')}</p>
            <p className="card-date-number">{event.timetable__initial_date.format('DD')}</p>
            <p className="card-date-hour">{event.timetable__initial_date.format('HH:mm')}h</p>
          </div>
          <AvatarWithIcon image={event?.place?.profile_pic} avatarSize={'4rem'} name={event?.place?.name} />
          {/* <img className="event-avatar" src={event?.place?.profile_pic} alt={event?.place?.name} /> */}
          {/* <p>
            status: {confirmationStatus}
            <span
              className={["event-confirm-status", eventConfirmStatusColor].join(
                " "
              )}
            ></span>
          </p> */}
        </div>

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
                {event.place.country.name}{' '}
                <Flag code={event.place.country.alpha2} height="15" style={{ border: '1px solid #999' }} />
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="footer">Ver más - Editar - Cancelar</div>
      {footer && <div className="profile-thumbnail-card-footer">{footer()}</div>}
    </div>
  );
};

import { Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectorEvents, useEventsSlice } from '~/common/slices/domain/events/events.redux';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { EventModel } from '~/models/domain/event/event.model';
import { MyEventsDataTemplate } from './config-events-list';

const EventsListPage = () => {
  // Slices
  const eventsList: EventModel[] = useSelector(selectorEvents.selectItems);
  const { actions: eventActions } = useEventsSlice();

  // Hooks
  const dispatch = useDispatch();
  const { translateText } = useI18n();
  const { navigateToEntity } = useNavigation();

  // Effects
  useEffect(() => {
    dispatch(eventActions.loadItems({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [entityData, setEntityData] = useState<MyEventsDataTemplate>({
    // requests: [],
    requests: [
      { id: 'asd', name: 'fdsfs', state: 3 },
      { id: 'asd2', name: 'hfghfg', state: 5 },
    ],
    expired_requests: [],
    upcoming_events: [],
    past_events: [],
  });

  // Crear el contexto del transformer por defecto
  // El buildComponent ahora se crea automáticamente en TabbedPanel si no se proporciona

  return (
    <>
      <h2>Mis eventos</h2>
      {/* <TabbedPanel rawConfig={EVENTS_LIST_PAGE_CONFIG} defaultTransformerContext={defaultTransformerContext} /> */}
      <ul>
        {eventsList.map((event) => (
          <li key={event.id}>
            <Link component="button" onClick={() => navigateToEntity({ entityType: EventModel.name, id: event.id })}>
              {event.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default EventsListPage;

import { useState } from 'react';
import { useI18n } from '~/common/utils';
import { DefaultTransformerContext, TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { EVENTS_LIST_PAGE_CONFIG, MyEventsDataTemplate, TRANSLATION_BASE_EVENTS_LIST_PAGE } from './config-events-list';

const EventsListPage = () => {
  const { translateText } = useI18n();

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
  const defaultTransformerContext: DefaultTransformerContext = {
    entityData,
    handlers: {},
    translationBasePath: TRANSLATION_BASE_EVENTS_LIST_PAGE,
    translateText,
  };

  return (
    <>
      <h2>Mis eventos</h2>
      <TabbedPanel rawConfig={EVENTS_LIST_PAGE_CONFIG} defaultTransformerContext={defaultTransformerContext} />
    </>
  );
};

export default EventsListPage;

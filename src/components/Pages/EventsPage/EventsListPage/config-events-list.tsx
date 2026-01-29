import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';

// export const TRANSLATION_BASE_EVENTS_LIST_PAGE = 'app.pages.EventsPages.EventsListPage';
export const TRANSLATION_BASE_EVENTS_LIST_PAGE = '';

export interface MyEventsDataTemplate {
  requests: any[];
  expired_requests: any[];
  upcoming_events: any[];
  past_events: any[];
}

export const EVENTS_LIST_PAGE_CONFIG: PageSection[] = [
  {
    name: 'requests',
    sections: [
      {
        name: 'active',
        components: [
          {
            componentName: ComponentTypes.TABLE,
            data: {
              tableConfig: (eventsData: MyEventsDataTemplate) => {
                console.log(eventsData);
                let config = undefined;
                if (eventsData?.requests?.length) {
                  config = {
                    columns: Object.keys(eventsData.requests[0]),
                    rows: eventsData.requests,
                    dense: true,
                    translationBasePath: 'attributes',
                  };
                }
                return config;
              },
            },
          },
        ],
      },
      {
        name: 'past',
        components: [
          {
            componentName: ComponentTypes.HTML_CONTENT,
            data: {
              content: '<p>Solicitudes pasadas aparecerán aquí</p>',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'upcoming',
    sections: [
      {
        name: 'events',
        emptyTitle: true,
        components: [
          {
            componentName: ComponentTypes.HTML_CONTENT,
            data: {
              content: '<p>Próximos eventos aparecerán aquí</p>',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'past',
    sections: [
      {
        name: 'events',
        emptyTitle: true,
        components: [
          {
            componentName: ComponentTypes.HTML_CONTENT,
            data: {
              content: '<p>Eventos pasados aparecerán aquí</p>',
            },
          },
        ],
      },
    ],
  },
];

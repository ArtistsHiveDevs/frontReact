import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';

export const TRANSLATION_BASE_OPEN_CALLS_LIST_PAGE = 'app.pages.OpenCallsListPage';

export interface MyOpenCallsDataTemplate {
  active_calls: any[];
  past_calls: any[];
  applications: any[];
}

// ─── Config para Places: muestra sus convocatorias creadas ───

export const OPEN_CALLS_LIST_PLACE_CONFIG: PageSection[] = [
  {
    name: 'active',
    sections: [
      {
        name: 'open_calls',
        emptyTitle: true,
        clickHandlerName: 'onClickRow',
        components: [
          {
            componentName: ComponentTypes.TABLE,
            data: {
              tableConfig: (data: MyOpenCallsDataTemplate) => {
                if (!data?.active_calls?.length) return undefined;
                return {
                  columns: ['event_name', 'event_date', 'start_date', 'end_date', 'status', 'applications_count'],
                  rows: data.active_calls,
                  dense: true,
                  translationBasePath: `${TRANSLATION_BASE_OPEN_CALLS_LIST_PAGE}.attributes`,
                };
              },
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
        name: 'open_calls',
        emptyTitle: true,
        components: [
          {
            componentName: ComponentTypes.HTML_CONTENT,
            data: {
              content: '<p>Convocatorias cerradas aparecerán aquí</p>',
            },
          },
        ],
      },
    ],
  },
];

// ─── Config para Artists: muestra convocatorias disponibles para aplicar ───

export const OPEN_CALLS_LIST_ARTIST_CONFIG: PageSection[] = [
  {
    name: 'available',
    sections: [
      {
        name: 'open_calls',
        emptyTitle: true,
        clickHandlerName: 'onClickRow',
        components: [
          {
            componentName: ComponentTypes.TABLE,
            data: {
              tableConfig: (data: MyOpenCallsDataTemplate) => {
                if (!data?.active_calls?.length) return undefined;
                return {
                  columns: ['event_name', 'event_date', 'end_date', 'city', 'genres'],
                  rows: data.active_calls,
                  dense: true,
                  translationBasePath: `${TRANSLATION_BASE_OPEN_CALLS_LIST_PAGE}.attributes`,
                };
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: 'applications',
    sections: [
      {
        name: 'my_applications',
        emptyTitle: true,
        clickHandlerName: 'onClickApplicationRow',
        components: [
          {
            componentName: ComponentTypes.TABLE,
            data: {
              tableConfig: (data: MyOpenCallsDataTemplate) => {
                if (!data?.applications?.length) return undefined;
                return {
                  columns: ['event_name', 'event_date', 'city', 'application_status'],
                  rows: data.applications,
                  dense: true,
                  translationBasePath: `${TRANSLATION_BASE_OPEN_CALLS_LIST_PAGE}.attributes`,
                };
              },
            },
          },
          {
            componentName: ComponentTypes.HTML_CONTENT,
            data: {
              render: (data: MyOpenCallsDataTemplate) =>
                !data?.applications?.length ? 'Todavía no has aplicado a ninguna convocatoria.' : '',
            },
          },
        ],
      },
    ],
  },
];

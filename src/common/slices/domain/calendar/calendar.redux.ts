import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { AgendaEventModel, AgendaEventTemplate } from '~/models/domain/calendar/agenda-event.model';

const sliceName = 'agendaEvents';
const resourceEndpoint = '/events/all_events';

export const selectorAgendaEvents = createEntitySelectors<typeof sliceName, AgendaEventModel, AgendaEventTemplate>({
  sliceName,
});

const { slice: agendaEventsSlice, saga: sagaAgendaEvents } = createEntitySlice({
  name: sliceName,
  Model: AgendaEventModel,
  initialState: {
    items: [],
    loading: false,
    error: null,
    detailedItems: {},
  },
  resourceEndpoint,
  selectors: {
    ...selectorAgendaEvents,
  },
  options: {
    disableOperations: {
      create: true,
      update: true,
      postAction: true,
      delete: true,
    },
  },
});

export const reducerAgendaEvents = agendaEventsSlice.reducer;
export const actionsAgendaEvents = agendaEventsSlice.actions;
export { sagaAgendaEvents };

export const useAgendaEventsSlice = () => {
  useInjectReducer({ key: agendaEventsSlice.name, reducer: agendaEventsSlice.reducer });
  useInjectSaga({ key: agendaEventsSlice.name, saga: sagaAgendaEvents });

  return { actions: agendaEventsSlice.actions };
};

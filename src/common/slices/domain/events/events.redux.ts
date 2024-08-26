import { EventModel, EventTemplate } from '~/models/domain/event/event.model';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'events';
const resourceEndpoint = `/${sliceName}`;

export const selectorEvents = createEntitySelectors<typeof sliceName, EventModel, EventTemplate>({ sliceName });

const { slice: eventSlice, saga: sagaEvents } = createEntitySlice({
  name: sliceName,
  Model: EventModel,
  initialState: {
    items: [],
    loading: false,
    error: null,
    detailedItems: {},
    newItemRQ: null,
    createdItem: null,
  },
  resourceEndpoint,
  selectors: {
    ...selectorEvents,
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerEvents = eventSlice.reducer;
export const actionsEvents = eventSlice.actions;
export { sagaEvents };

export const useEventsSlice = () => {
  useInjectReducer({ key: eventSlice.name, reducer: eventSlice.reducer });
  useInjectSaga({ key: eventSlice.name, saga: sagaEvents });

  return { actions: eventSlice.actions };
};

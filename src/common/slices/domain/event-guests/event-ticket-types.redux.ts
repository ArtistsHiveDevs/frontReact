import { EventTicketTypeModel, EventTicketTypeTemplate } from '~/models/domain/event-guest/v1';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'eventTicketTypes';
const resourceEndpoint = '/event-ticket-types';

export const selectorEventTicketTypes = createEntitySelectors<
  typeof sliceName,
  EventTicketTypeModel,
  EventTicketTypeTemplate
>({ sliceName });

const { slice: eventTicketTypeSlice, saga: sagaEventTicketTypes } = createEntitySlice({
  name: sliceName,
  Model: EventTicketTypeModel,
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
    ...selectorEventTicketTypes,
  },
});

export const reducerEventTicketTypes = eventTicketTypeSlice.reducer;
export const actionsEventTicketTypes = eventTicketTypeSlice.actions;
export { sagaEventTicketTypes };

export const useEventTicketTypesSlice = () => {
  useInjectReducer({ key: eventTicketTypeSlice.name, reducer: eventTicketTypeSlice.reducer });
  useInjectSaga({ key: eventTicketTypeSlice.name, saga: sagaEventTicketTypes });

  return { actions: eventTicketTypeSlice.actions };
};

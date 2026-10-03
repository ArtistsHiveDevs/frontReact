import { EventGuestModel, EventGuestTemplate } from '~/models/domain/event-guest/v1';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'eventGuests';
const resourceEndpoint = '/event-guests';

export const selectorEventGuests = createEntitySelectors<typeof sliceName, EventGuestModel, EventGuestTemplate>({
  sliceName,
});

const { slice: eventGuestSlice, saga: sagaEventGuests } = createEntitySlice({
  name: sliceName,
  Model: EventGuestModel,
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
    ...selectorEventGuests,
  },
});

export const reducerEventGuests = eventGuestSlice.reducer;
export const actionsEventGuests = eventGuestSlice.actions;
export { sagaEventGuests };

export const useEventGuestsSlice = () => {
  useInjectReducer({ key: eventGuestSlice.name, reducer: eventGuestSlice.reducer });
  useInjectSaga({ key: eventGuestSlice.name, saga: sagaEventGuests });

  return { actions: eventGuestSlice.actions };
};

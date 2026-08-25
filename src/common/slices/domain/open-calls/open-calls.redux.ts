import { OpenCallModel, OpenCallTemplate } from '~/models/domain/open-call/v1';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'openCalls';
const resourceEndpoint = '/open-calls';

export const selectorOpenCalls = createEntitySelectors<typeof sliceName, OpenCallModel, OpenCallTemplate>({ sliceName });

const { slice: openCallSlice, saga: sagaOpenCalls } = createEntitySlice({
  name: sliceName,
  Model: OpenCallModel,
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
    ...selectorOpenCalls,
  },
});

export const reducerOpenCalls = openCallSlice.reducer;
export const actionsOpenCalls = openCallSlice.actions;
export { sagaOpenCalls };

export const useOpenCallsSlice = () => {
  useInjectReducer({ key: openCallSlice.name, reducer: openCallSlice.reducer });
  useInjectSaga({ key: openCallSlice.name, saga: sagaOpenCalls });

  return { actions: openCallSlice.actions };
};

import {
  OpenCallApplicationModel,
  OpenCallApplicationTemplate,
} from '~/models/domain/open-call/v1';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'openCallApplications';
const resourceEndpoint = '/open-call-applications';

export const selectorOpenCallApplications = createEntitySelectors<
  typeof sliceName,
  OpenCallApplicationModel,
  OpenCallApplicationTemplate
>({ sliceName });

const { slice: openCallApplicationSlice, saga: sagaOpenCallApplications } = createEntitySlice({
  name: sliceName,
  Model: OpenCallApplicationModel,
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
    ...selectorOpenCallApplications,
  },
});

export const reducerOpenCallApplications = openCallApplicationSlice.reducer;
export const actionsOpenCallApplications = openCallApplicationSlice.actions;
export { sagaOpenCallApplications };

export const useOpenCallApplicationsSlice = () => {
  useInjectReducer({ key: openCallApplicationSlice.name, reducer: openCallApplicationSlice.reducer });
  useInjectSaga({ key: openCallApplicationSlice.name, saga: sagaOpenCallApplications });

  return { actions: openCallApplicationSlice.actions };
};

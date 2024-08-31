import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { MDDocumentModel, MDDocumentTemplate } from '~/models/app/md-model/md-model';

const sliceName = 'PrivacyPolicy';
const resourceEndpoint = `/privacy`;

export const selectorPrivacyPolicy = createEntitySelectors<typeof sliceName, MDDocumentModel, MDDocumentTemplate>({
  sliceName,
});

const { slice: privacyPolicySlice, saga: sagaPrivacyPolicy } = createEntitySlice({
  name: sliceName,
  Model: MDDocumentModel,
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
    ...selectorPrivacyPolicy,
  },
  options: {
    disableOperations: {},
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerPrivacyPolicy = privacyPolicySlice.reducer;
export const actionsPrivacyPolicy = privacyPolicySlice.actions;
export { sagaPrivacyPolicy };

export const usePrivacyPolicySlice = () => {
  useInjectReducer({ key: privacyPolicySlice.name, reducer: privacyPolicySlice.reducer });
  useInjectSaga({ key: privacyPolicySlice.name, saga: sagaPrivacyPolicy });

  return { actions: privacyPolicySlice.actions };
};

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { MDDocumentModel, MDDocumentTemplate } from '~/models/app/md-model/md-model';

const sliceName = 'termsAndConditions';
const resourceEndpoint = `/terms`;

export const selectorTermsAndConditions = createEntitySelectors<typeof sliceName, MDDocumentModel, MDDocumentTemplate>({
  sliceName,
});

const { slice: termsAndConditionsSlice, saga: sagaTermsAndConditions } = createEntitySlice({
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
    ...selectorTermsAndConditions,
  },
  options: {
    disableOperations: {},
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerTermsAndConditions = termsAndConditionsSlice.reducer;
export const actionsTermsAndConditions = termsAndConditionsSlice.actions;
export { sagaTermsAndConditions };

export const useTermsAndConditionsSlice = () => {
  useInjectReducer({ key: termsAndConditionsSlice.name, reducer: termsAndConditionsSlice.reducer });
  useInjectSaga({ key: termsAndConditionsSlice.name, saga: sagaTermsAndConditions });

  return { actions: termsAndConditionsSlice.actions };
};

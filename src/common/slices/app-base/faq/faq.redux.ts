import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { MDDocumentModel, MDDocumentTemplate } from '~/models/app/md-model/md-model';

const sliceName = 'faq';
const resourceEndpoint = `/${sliceName}`;

export const selectorFAQ = createEntitySelectors<typeof sliceName, MDDocumentModel, MDDocumentTemplate>({
  sliceName,
});

const { slice: faqSlice, saga: sagaFAQ } = createEntitySlice({
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
    ...selectorFAQ,
  },
  options: {
    disableOperations: {},
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerFAQ = faqSlice.reducer;
export const actionsFAQ = faqSlice.actions;
export { sagaFAQ };

export const useFAQSlice = () => {
  useInjectReducer({ key: faqSlice.name, reducer: faqSlice.reducer });
  useInjectSaga({ key: faqSlice.name, saga: sagaFAQ });

  return { actions: faqSlice.actions };
};

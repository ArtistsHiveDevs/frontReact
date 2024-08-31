import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { MDDocumentModel, MDDocumentTemplate } from '~/models/app/md-model/md-model';

const sliceName = 'industryOffer';
const resourceEndpoint = `/${sliceName}`;

export const selectorIndustryOffer = createEntitySelectors<typeof sliceName, MDDocumentModel, MDDocumentTemplate>({
  sliceName,
});

const { slice: industryOfferSlice, saga: sagaIndustryOffer } = createEntitySlice({
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
    ...selectorIndustryOffer,
  },
  options: {
    disableOperations: {},
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerIndustryOffer = industryOfferSlice.reducer;
export const actionsIndustryOffer = industryOfferSlice.actions;
export { sagaIndustryOffer };

export const useIndustryOfferSlice = () => {
  useInjectReducer({ key: industryOfferSlice.name, reducer: industryOfferSlice.reducer });
  useInjectSaga({ key: industryOfferSlice.name, saga: sagaIndustryOffer });

  return { actions: industryOfferSlice.actions };
};

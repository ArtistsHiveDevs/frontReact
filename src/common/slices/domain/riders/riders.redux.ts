import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { ArtistRiderModel } from '~/models/domain/rider/rider.model';

const sliceName = 'riders';
const resourceEndpoint = `/${sliceName}`;

export const selectorRiders = createEntitySelectors({ sliceName });

const { slice: riderSlice, saga: sagaRiders } = createEntitySlice({
  name: sliceName,
  Model: ArtistRiderModel,
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
    ...selectorRiders,
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerRiders = riderSlice.reducer;
export const actionsRiders = riderSlice.actions;
export { sagaRiders };

export const useRidersSlice = () => {
  useInjectReducer({ key: riderSlice.name, reducer: riderSlice.reducer });
  useInjectSaga({ key: riderSlice.name, saga: sagaRiders });

  return { actions: riderSlice.actions };
};

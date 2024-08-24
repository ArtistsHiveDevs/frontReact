import { PlaceModel } from '~/models/domain/place/place.model';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'places';
const resourceEndpoint = `/${sliceName}`;

export const selectorPlaces = createEntitySelectors({ sliceName });

const { slice: placeSlice, saga: sagaPlaces } = createEntitySlice({
  name: sliceName,
  Model: PlaceModel,
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
    ...selectorPlaces,
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerPlaces = placeSlice.reducer;
export const actionsPlaces = placeSlice.actions;
export { sagaPlaces };

export const usePlacesSlice = () => {
  useInjectReducer({ key: placeSlice.name, reducer: placeSlice.reducer });
  useInjectSaga({ key: placeSlice.name, saga: sagaPlaces });

  return { actions: placeSlice.actions };
};

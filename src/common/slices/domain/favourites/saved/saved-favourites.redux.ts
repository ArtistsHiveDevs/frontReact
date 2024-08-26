import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { SavedModel, SavedTemplate } from '~/models/domain/favourites/saved';

const sliceName = 'savedFavourites';
const resourceEndpoint = `/${sliceName}`;

export const selectorSavedFavourites = createEntitySelectors<typeof sliceName, SavedModel, SavedTemplate>({
  sliceName,
});

const { slice: savedFavouritesSlice, saga: sagaSavedFavourites } = createEntitySlice({
  name: sliceName,
  Model: SavedModel,
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
    ...selectorSavedFavourites,
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerSavedFavourites = savedFavouritesSlice.reducer;
export const actionsSavedFavourites = savedFavouritesSlice.actions;
export { sagaSavedFavourites };

export const useSavedFavouritesSlice = () => {
  useInjectReducer({ key: savedFavouritesSlice.name, reducer: savedFavouritesSlice.reducer });
  useInjectSaga({ key: savedFavouritesSlice.name, saga: sagaSavedFavourites });

  return { actions: savedFavouritesSlice.actions };
};

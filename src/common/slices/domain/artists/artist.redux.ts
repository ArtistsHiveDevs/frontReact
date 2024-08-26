import { ArtistModel, ArtistTemplate } from '~/models/domain/artist/artist.model';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'artists';
const resourceEndpoint = `/${sliceName}`;

export const selectorArtists = createEntitySelectors<typeof sliceName, ArtistModel, ArtistTemplate>({ sliceName });

const { slice: artistSlice, saga: sagaArtists } = createEntitySlice({
  name: sliceName,
  Model: ArtistModel,
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
    ...selectorArtists,
  },
  options: {
    disableOperations: {},
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerArtists = artistSlice.reducer;
export const actionsArtists = artistSlice.actions;
export { sagaArtists };

export const useArtistsSlice = () => {
  useInjectReducer({ key: artistSlice.name, reducer: artistSlice.reducer });
  useInjectSaga({ key: artistSlice.name, saga: sagaArtists });

  return { actions: artistSlice.actions };
};

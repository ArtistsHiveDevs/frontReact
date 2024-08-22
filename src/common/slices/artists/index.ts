import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { ArtistModel, ArtistTemplate } from '~/models/domain/artist/artist.model';

import { artistSaga } from './saga';
import { ArtistErrorType, ArtistState } from './types';

export const artistsInitialState: ArtistState = {
  artists: [],
  loading: false,
  error: null,
  artistsQueryParams: '',
  queriedArtists: [],
  queriedId: '',
  detailedArtists: {},
  newArtistRQ: undefined,
  createdArtist: undefined,
};

const slice = createSlice({
  name: 'ArtistsReducer',
  initialState: artistsInitialState,
  reducers: {
    loadArtists(state) {
      state.loading = true;
      state.error = null;
      state.artists = [];
    },
    artistLoaded(state, action: PayloadAction<ArtistTemplate[]>) {
      const artists = (action.payload || []).map((template) => new ArtistModel(template));

      state.artists = artists;
      state.loading = false;
    },
    queryArtists(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.queriedArtists = [];
      state.artistsQueryParams = action?.payload;
    },
    artistsQueried(state, action: PayloadAction<ArtistTemplate[] | []>) {
      const artistsQuery = action.payload.map((template) => new ArtistModel(template));

      state.queriedArtists = artistsQuery;
      state.loading = false;
    },
    getArtistById(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.queriedId = action?.payload;
    },
    artistByIdLoaded(state, action: PayloadAction<ArtistTemplate>) {
      const foundArtist = new ArtistModel(action.payload);

      state.detailedArtists[foundArtist.id] = foundArtist;
      const previousIndex = state.artists.findIndex((artist) => artist.id === foundArtist.id);
      if (previousIndex >= 0) {
        state.artists[previousIndex] = foundArtist;
      } else {
        state.artists = [...state.artists, foundArtist];
      }
      state.loading = false;
    },
    createArtist(state, action: PayloadAction<ArtistTemplate>) {
      state.loading = true;
      state.newArtistRQ = action.payload;
      state.createdArtist = undefined;
    },
    createdArtist(state, action: PayloadAction<ArtistTemplate>) {
      const newArtist = new ArtistModel(action.payload);

      state.detailedArtists[newArtist.id] = newArtist;
      const previousIndex = state.artists.findIndex((artist) => artist.id === newArtist.id);
      if (previousIndex >= 0) {
        state.artists[previousIndex] = newArtist;
      } else {
        state.artists = [...state.artists, newArtist];
      }
      state.createdArtist = newArtist;
      state.newArtistRQ = undefined;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<ArtistErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: artistsActions, reducer } = slice;

export const useArtistsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: artistSaga });

  return { actions: slice.actions };
};

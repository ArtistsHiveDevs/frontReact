import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";
import { ArtistModel } from "~/models/domain/artist/artist.model";

import { artistSaga } from "./saga";
import { ArtistErrorType, ArtistState } from "./types";

export const artistsInitialState: ArtistState = {
  artists: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "ArtistsReducer",
  initialState: artistsInitialState,
  reducers: {
    loadArtists(state) {
      state.loading = true;
      state.error = null;
      state.artists = [];
    },
    artistLoaded(state, action: PayloadAction<ArtistModel[]>) {
      const artists = action.payload.map(
        (template) => new ArtistModel(template)
      );

      state.artists = artists;
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

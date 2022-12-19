import { PayloadAction } from "@reduxjs/toolkit";

import { ArtistModel } from "~/constants";
import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";

import { artistSaga } from "./saga";
import { ArtistErrorType, ArtistState } from "./types";

export const initialState: ArtistState = {
  artists: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "ArtistsReducer",
  initialState,
  reducers: {
    loadArtists(state) {
      state.loading = true;
      state.error = null;
      state.artists = [];
    },
    artistLoaded(state, action: PayloadAction<ArtistModel[]>) {
      const artists = action.payload;

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

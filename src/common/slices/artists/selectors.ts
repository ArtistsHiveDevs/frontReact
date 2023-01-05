import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { artistsInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.ArtistsReducer || artistsInitialState;

export const selectLoading = createSelector(
  [selectDomain],
  (ArtistState) => ArtistState.loading
);

export const selectError = createSelector(
  [selectDomain],
  (ArtistState) => ArtistState.error
);

export const selectArtists = createSelector(
  [selectDomain],
  (ArtistState) => ArtistState.artists
);
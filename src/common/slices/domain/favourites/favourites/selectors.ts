import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { savedFavouritesInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.SavedFavouritesReducer || savedFavouritesInitialState;

export const selectLoading = createSelector(
  [selectDomain],
  (SavedFavouritesState) => SavedFavouritesState.loading
);

export const selectError = createSelector(
  [selectDomain],
  (SavedFavouritesState) => SavedFavouritesState.error
);

export const selectSavedFavourites = createSelector(
  [selectDomain],
  (SavedFavouritesState) => SavedFavouritesState.savedFavourites
);

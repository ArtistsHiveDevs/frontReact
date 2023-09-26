import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { SavedInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.SavedReducer || SavedInitialState;

export const selectSavedLoading = createSelector(
  [selectDomain],
  (SavedState) => SavedState.loading
);

export const selectSavedError = createSelector(
  [selectDomain],
  (SavedState) => SavedState.error
);

export const selectSaved = createSelector(
  [selectDomain],
  (SavedState) => SavedState.saved
);

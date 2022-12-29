import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { placesInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.PlacesReducer || placesInitialState;

export const selectLoading = createSelector(
  [selectDomain],
  (PlaceState) => PlaceState.loading
);

export const selectError = createSelector(
  [selectDomain],
  (PlaceState) => PlaceState.error
);

export const selectPlaces = createSelector(
  [selectDomain],
  (PlaceState) => PlaceState.places
);

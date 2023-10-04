import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { TourOutlineInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.ToursOutlinesReducer || TourOutlineInitialState;

export const selectTourOutlineLoading = createSelector(
  [selectDomain],
  (TourOutlineState) => TourOutlineState.loading
);

export const selectTourOutlineError = createSelector(
  [selectDomain],
  (TourOutlineState) => TourOutlineState.error
);

export const selectTourOutline = createSelector(
  [selectDomain],
  (TourOutlineState) => TourOutlineState.toursOutlines
);

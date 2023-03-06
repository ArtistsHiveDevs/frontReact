import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { academiesInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.AcademiesReducer || academiesInitialState;

export const academiesSelectLoading = createSelector(
  [selectDomain],
  (AcademyState) => AcademyState.loading
);

export const academiesSelectError = createSelector(
  [selectDomain],
  (AcademyState) => AcademyState.error
);

export const selectAcademies = createSelector(
  [selectDomain],
  (AcademyState) => AcademyState.academies
);

export const selectQueriedAcademies = createSelector(
  [selectDomain],
  (AcademyState) => AcademyState.queriedAcademies
);

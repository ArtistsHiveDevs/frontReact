import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { usersInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.UsersReducer || usersInitialState;

export const selectLoading = createSelector(
  [selectDomain],
  (UserState) => UserState.loading
);

export const selectError = createSelector(
  [selectDomain],
  (UserState) => UserState.error
);

export const selectUsers = createSelector(
  [selectDomain],
  (UserState) => UserState.users
);

import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { privacyPolicyInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.PrivacyPolicyReducer || privacyPolicyInitialState;

export const selectLoading = createSelector(
  [selectDomain],
  (PrivacyPolicyState) => PrivacyPolicyState.loading
);

export const selectError = createSelector(
  [selectDomain],
  (PrivacyPolicyState) => PrivacyPolicyState.error
);

export const selectPrivacyPolicy = createSelector(
  [selectDomain],
  (PrivacyPolicyState) => PrivacyPolicyState.policy
);

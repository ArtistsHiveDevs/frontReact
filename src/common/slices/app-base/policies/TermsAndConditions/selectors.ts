import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { termsAndConditionsInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.TermsAndConditionsReducer || termsAndConditionsInitialState;

export const selectLoading = createSelector(
  [selectDomain],
  (TermsAndConditionsState) => TermsAndConditionsState.loading
);

export const selectError = createSelector([selectDomain], (TermsAndConditionsState) => TermsAndConditionsState.error);

export const selectTermsAndConditions = createSelector(
  [selectDomain],
  (TermsAndConditionsState) => TermsAndConditionsState.terms
);

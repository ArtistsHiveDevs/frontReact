import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { reportClaimInitialState } from '.';

const selectDomain = (state: RootState) => state?.ReportClaimReducer || reportClaimInitialState;

export const selectReportClaimLoading = createSelector([selectDomain], (state) => state.loading);

export const selectReportClaimSuccess = createSelector([selectDomain], (state) => state.success);

export const selectReportClaimError = createSelector([selectDomain], (state) => ({
  errorType: state.error,
  error: state.errorContent,
}));

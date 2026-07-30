import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

import { reportClaimSaga } from './saga';
import { ReportClaimErrorType, ReportClaimState, SubmitReportClaimPayload } from './types';

export const reportClaimInitialState: ReportClaimState = {
  loading: false,
  success: false,
  error: null,
  errorContent: null,
};

const slice = createSlice({
  name: 'ReportClaimReducer',
  initialState: reportClaimInitialState,
  reducers: {
    submitReportClaim(state, action: PayloadAction<SubmitReportClaimPayload>) {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.errorContent = null;
    },
    reportClaimSucceeded(state) {
      state.loading = false;
      state.success = true;
    },
    reportClaimFailed(state, action: PayloadAction<{ errorType: ReportClaimErrorType; error: any }>) {
      state.loading = false;
      state.success = false;
      state.error = action.payload.errorType;
      state.errorContent = action.payload.error;
    },
    resetReportClaimState(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.errorContent = null;
    },
  },
});

export const { actions: reportClaimActions, reducer } = slice;

export const useReportClaimSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: reportClaimSaga });

  return { actions: slice.actions };
};

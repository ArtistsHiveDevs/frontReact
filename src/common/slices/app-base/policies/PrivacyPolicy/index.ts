import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { PrivacyPolicyModel, PrivacyPolicyTemplate } from '~/models/app/policies/privacy/PrivacyPolicy.model';

import { privacyPolicySaga } from './saga';
import { PrivacyPolicyErrorType, PrivacyPolicyState } from './types';

export const privacyPolicyInitialState: PrivacyPolicyState = {
  queriedTermsVersion: undefined,
  policy: undefined,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'PrivacyPolicyReducer',
  initialState: privacyPolicyInitialState,
  reducers: {
    loadPrivacyPolicy(state, action?: PayloadAction<{ version: string }>) {
      state.loading = true;
      state.error = null;
      state.policy = undefined;
      state.queriedTermsVersion = action?.payload?.version;
    },
    privacyPolicyLoaded(state, action: PayloadAction<PrivacyPolicyTemplate>) {
      state.policy = new PrivacyPolicyModel(action.payload);
      state.loading = false;
    },
    repoError(state, action: PayloadAction<PrivacyPolicyErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions, reducer } = slice;

export const usePrivacyPolicySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: privacyPolicySaga });

  return { actions: slice.actions };
};

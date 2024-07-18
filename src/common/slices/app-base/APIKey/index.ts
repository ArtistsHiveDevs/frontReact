import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

import { LocalStorageVariables } from '~/constants/localstorage';
import { apiKeySaga } from './saga';
import { ApiKeyErrorType, ApiKeyState } from './types';

export const apiKeyInitialState: ApiKeyState = {
  apiKey: undefined,
  userId: undefined,
  password: undefined,
  remember_me: undefined,
  loading: false,
  error: null,
  errorContent: null,
  isLogout: false,
};

const slice = createSlice({
  name: 'ApiKeyReducer',
  initialState: apiKeyInitialState,
  reducers: {
    loadApiKey(
      state,
      action?: PayloadAction<{ userId?: string; password?: string; remember_me?: boolean; isLogout?: boolean }>
    ) {
      state.loading = true;
      state.error = null;
      state.errorContent = null;
      state.apiKey = undefined;
      state.userId = action?.payload?.userId;
      state.password = action?.payload?.password;
      state.remember_me = action?.payload?.remember_me;
      state.isLogout = action?.payload?.isLogout;
    },
    apiKeyLoaded(state, action: PayloadAction<{ apiKey: string }>) {
      state.apiKey = action.payload.apiKey;
      state.password = undefined;
      state.loading = false;

      localStorage.setItem(LocalStorageVariables.TOKEN_API_KEY, state.apiKey);
    },
    repoError(state, action: PayloadAction<{ errorType: ApiKeyErrorType; error: any }>) {
      state.error = action.payload.errorType;
      state.errorContent = action.payload.error;
      state.userId = undefined;
      state.password = undefined;
      state.loading = false;
    },
    logout(state) {
      state = apiKeyInitialState;
    },
  },
});

export const { actions, reducer } = slice;

export const useApiKeySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: apiKeySaga });

  return { actions: slice.actions };
};

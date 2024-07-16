import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { apiKeyInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.ApiKeyReducer || apiKeyInitialState;

export const selectLoading = createSelector([selectDomain], (ApiKeyState) => ApiKeyState.loading);

export const selectError = createSelector([selectDomain], (ApiKeyState) => {
  return { errorType: ApiKeyState.error, error: ApiKeyState.errorContent };
});

export const selectApiKey = createSelector([selectDomain], (ApiKeyState) => {
  return { apiKey: ApiKeyState.apiKey, userId: ApiKeyState.userId };
});

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { profileInitialState } from './ProfileSlice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.UsersReducer || profileInitialState;

export const selectLoading = createSelector([selectDomain], (UserState) => UserState.loading);

export const selectError = createSelector([selectDomain], (UserState) => UserState.error);

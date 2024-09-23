import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { LocalStorageVariables } from '~/constants/localstorage';
import { usersInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.UsersReducer || usersInitialState;

export const selectLoading = createSelector([selectDomain], (UserState) => UserState.loading);

export const selectError = createSelector([selectDomain], (UserState) => UserState.error);

export const selectUsers = createSelector([selectDomain], (UserState) => UserState.users);

export const selectCurrentUser = createSelector([selectDomain], (UserState) => UserState.currentUser);

export const selectCurrentLang = createSelector([selectDomain], (UserState): string => {
  return (
    UserState.currentUser?.user_language ||
    localStorage.getItem(LocalStorageVariables.CURRENT_LANGUAGE) ||
    import.meta.env.VITE_DEFAULT_LANGUAGE ||
    'en'
  );
});

export const selectUsernameValidation = createSelector([selectDomain], (UserState) => UserState.usernameAvailabilityResult);

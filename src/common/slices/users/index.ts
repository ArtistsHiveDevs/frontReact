import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { AppUserModel, AppUserTemplate, UNLOGGED_USER } from '~/models/app/user/user.model';

import { userSaga } from './saga';
import { UserErrorType, UserState } from './types';
import { UsernameAvailabilityStatus } from '~/constants/app.constants';

export const usersInitialState: UserState = {
  users: [],
  currentUser: undefined,
  newUserRQInfo: undefined,
  usernameForAvailabilityCheck: undefined,
  usernameAvailabilityResult: undefined,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'UsersReducer',
  initialState: usersInitialState,
  reducers: {
    loadUsers(state) {
      state.loading = true;
      state.error = null;
      state.users = [];
    },
    userLoaded(state, action: PayloadAction<AppUserTemplate[]>) {
      const users = action.payload.map((template) => new AppUserModel(template));
      state.error = null;
      state.users = users;
      state.loading = false;
    },
    loadCurrentUser(state) {
      state.loading = true;
      state.error = null;
      state.currentUser = UNLOGGED_USER;
    },
    currentUserLoaded(state, action: PayloadAction<AppUserTemplate>) {
      state.currentUser = action?.payload ? new AppUserModel(action.payload) : UNLOGGED_USER;
      state.loading = false;
      state.error = null;
    },
    checkUsernameAvailability(state, action: PayloadAction<string>){
      state.usernameForAvailabilityCheck = action.payload;
      state.loading = true;
      state.error = null;
    },
    usernameStatusVefication(state, action: PayloadAction<UsernameAvailabilityStatus>){
      state.usernameAvailabilityResult = action?.payload;
      state.loading = false;
    },
    createUser(state, action: PayloadAction<{username:string, sub:string}>){
      state.newUserRQInfo = action.payload;
      state.loading = true;
      state.error = null;
    },
    switchProfile(state, action: PayloadAction<{ id: string }>) {
      state.loading = true;
    },
    switchLang(state, action: PayloadAction<{ newLang: string }>) {
      state.loading = true;
    },
    repoError(state, action: PayloadAction<UserErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state = usersInitialState;
    },
  },
});

export const { actions: usersActions, reducer } = slice;

export const useUsersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userSaga });

  return { actions: slice.actions };
};

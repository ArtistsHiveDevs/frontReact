import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { AppUserModel, AppUserTemplate, UNLOGGED_USER } from '~/models/app/user/user.model';

import { userSaga } from './saga';
import { UserErrorType, UserState } from './types';

export const usersInitialState: UserState = {
  users: [],
  currentUser: undefined,
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
    switchProfile(state, action: PayloadAction<{ id: string }>) {
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

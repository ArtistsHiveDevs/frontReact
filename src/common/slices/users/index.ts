import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { AppUserModel, AppUserTemplate, UNLOGGED_USER } from '~/models/app/user/user.model';

import { UsernameAvailabilityStatus } from '~/constants/app.constants';
import { ProfileTemplate } from '~/models/base';
import { userSaga } from './saga';
import { UserErrorType, UserState } from './types';

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
    checkUsernameAvailability(state, action: PayloadAction<string>) {
      state.usernameForAvailabilityCheck = action.payload;
      state.loading = true;
      state.error = null;
    },
    usernameStatusVefication(state, action: PayloadAction<UsernameAvailabilityStatus>) {
      state.usernameAvailabilityResult = action?.payload;
      state.loading = false;
    },
    createUser(state, action: PayloadAction<{ username: string; sub: string; email: string }>) {
      state.newUserRQInfo = action.payload;
      state.loading = true;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<{ id: string; newItem: Partial<AppUserModel> }>) {
      state.loading = true;
    },
    claimProfileUser(state, action: PayloadAction<{ profile: ProfileTemplate }>) {
      state.loading = true;
    },
    followProfileUser(state, action: PayloadAction<{ action: 'follow' | 'unfollow'; profile: ProfileTemplate }>) {
      state.loading = true;
    },
    switchProfile(state, action: PayloadAction<{ id: string }>) {
      state.loading = true;
    },
    switchLang(state, action: PayloadAction<{ newLang: string }>) {
      state.loading = true;
    },
    voidRQ(state, action: PayloadAction<any>) {
      state.loading = false;
    },
    repoError(state, action: PayloadAction<UserErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state = usersInitialState;
    },
    itemUpdatePartial(state, action: PayloadAction<{ id: string; item: any }>) {
      const { id, item } = action.payload;
      if (state.currentUser && (state.currentUser.id === id || state.currentUser.username === id)) {
        // Verificar si realmente hay cambios antes de actualizar
        const hasChanges = Object.keys(item).some(
          (key) => JSON.stringify(state.currentUser.rawTemplate[key]) !== JSON.stringify(item[key])
        );

        if (hasChanges) {
          // Actualizar currentUser con los datos parciales recibidos
          state.currentUser = new AppUserModel({ ...state.currentUser.rawTemplate, ...item });
        }
      }
      // También actualizar en la lista de users si existe
      const userIndex = state.users.findIndex((user) => user.id === id || user.username === id);
      if (userIndex !== -1) {
        const hasChanges = Object.keys(item).some(
          (key) => JSON.stringify(state.users[userIndex].rawTemplate[key]) !== JSON.stringify(item[key])
        );

        if (hasChanges) {
          state.users[userIndex] = new AppUserModel({ ...state.users[userIndex].rawTemplate, ...item });
        }
      }
    },
  },
});

export const { actions: usersActions, reducer } = slice;

export const useUsersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userSaga });

  return { actions: slice.actions };
};

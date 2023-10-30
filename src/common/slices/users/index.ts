import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";
import { AppUserModel } from "~/models/app/user/user.model";

import { userSaga } from "./saga";
import { UserErrorType, UserState } from "./types";

export const usersInitialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "UsersReducer",
  initialState: usersInitialState,
  reducers: {
    loadUsers(state) {
      state.loading = true;
      state.error = null;
      state.users = [];
    },
    userLoaded(state, action: PayloadAction<AppUserModel[]>) {
      const users = action.payload.map(
        (template) => new AppUserModel(template)
      );

      state.users = users;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<UserErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: usersActions, reducer } = slice;

export const useUsersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userSaga });

  return { actions: slice.actions };
};

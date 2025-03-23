import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { AppUserTemplate } from '~/models/app/user/user.model';

import { EntityModel } from '~/models/base';
import { profileSaga } from './saga';
import { ProfileErrorType, ProfileState } from './types';

export const profileInitialState: ProfileState = {
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'ProfileReducer',
  initialState: profileInitialState,
  reducers: {
    loadProfileSubset(state, action: PayloadAction<{ fields: string[] }>) {
      state.loading = true;
      state.error = null;
    },
    profileSubsetLoaded(state, action: PayloadAction<AppUserTemplate[]>) {
      state.error = null;
      state.loading = false;
    },
    loadProfileEndpoint(state, action: PayloadAction<{ entity: EntityModel<any>; endpoint: string }>) {
      state.error = null;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<ProfileErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: profileActions, reducer } = slice;

export const useProfilesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: profileSaga });

  return { actions: slice.actions };
};

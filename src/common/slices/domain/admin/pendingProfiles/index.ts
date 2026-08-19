import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

import { pendingProfilesSaga } from './saga';
import {
  PendingProfilesData,
  PendingProfilesErrorType,
  PendingProfilesState,
  ReviewProfilePayload,
} from './types';

export const pendingProfilesInitialState: PendingProfilesState = {
  artists: [],
  places: [],
  loading: false,
  reviewingId: undefined,
  error: null,
  errorContent: null,
};

const slice = createSlice({
  name: 'PendingProfilesReducer',
  initialState: pendingProfilesInitialState,
  reducers: {
    loadPendingProfiles(state) {
      state.loading = true;
      state.error = null;
      state.errorContent = null;
    },
    pendingProfilesLoaded(state, action: PayloadAction<PendingProfilesData>) {
      state.artists = action.payload.artists;
      state.places = action.payload.places;
      state.loading = false;
    },
    reviewProfile(state, action: PayloadAction<ReviewProfilePayload>) {
      state.reviewingId = action.payload.id;
      state.error = null;
      state.errorContent = null;
    },
    reviewProfileDone(state) {
      state.reviewingId = undefined;
    },
    repoError(state, action: PayloadAction<{ errorType: PendingProfilesErrorType; error: any }>) {
      state.error = action.payload.errorType;
      state.errorContent = action.payload.error;
      state.loading = false;
      state.reviewingId = undefined;
    },
  },
});

export const { actions: pendingProfilesActions, reducer } = slice;

export const usePendingProfilesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: pendingProfilesSaga });

  return { actions: slice.actions };
};

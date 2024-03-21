import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

import { SavedModel } from '~/models/domain/favourites/saved';
import { savedSaga } from './saga';
import { SavedErrorType, SavedState } from './types';

export const SavedInitialState: SavedState = {
  saved: null,
  loading: false,
  error: null,
  savedQueryParam: '',
};

const slice = createSlice({
  name: 'SavedReducer',
  initialState: SavedInitialState,
  reducers: {
    querySaved(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.saved = null;
      state.savedQueryParam = action?.payload;
    },
    savedQueried(state, action: PayloadAction<SavedModel>) {
      state.saved = new SavedModel(action.payload);
      state.loading = false;
    },
    repoError(state, action: PayloadAction<SavedErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: savedActions, reducer } = slice;

export const useSavedSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: savedSaga });

  return { actions: slice.actions };
};

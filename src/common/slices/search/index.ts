import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { SearchModel } from '~/models/domain/search/search.model';

import { logEvent } from '~/common/utils/analytics/analytics';
import { searchSaga } from './saga';
import { SearchErrorType, SearchState } from './types';

export const SearchInitialState: SearchState = {
  search: null,
  loading: false,
  error: null,
  searchQueryParam: '',
};

const slice = createSlice({
  name: 'SearchReducer',
  initialState: SearchInitialState,
  reducers: {
    querySearch(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.search = null;
      state.searchQueryParam = action?.payload;

      if (action?.payload?.length >= 3) {
        logEvent('search', 'Search', `Search term: ${action?.payload}`);
      }
    },
    searchQueried(state, action: PayloadAction<SearchModel>) {
      state.search = new SearchModel(action.payload);
      state.loading = false;
    },
    repoError(state, action: PayloadAction<SearchErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: searchActions, reducer } = slice;

export const useSearchSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: searchSaga });

  return { actions: slice.actions };
};

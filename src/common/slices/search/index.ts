import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { SearchModel } from '~/models/domain/search/search.model';

import { trackSearch, trackSearchNoResults } from '~/common/utils/analytics';
import { EntityType } from '~/common/utils/analytics/events';
import { searchSaga } from './saga';
import { SearchErrorType, SearchQueryParams, SearchState } from './types';

export const SearchInitialState: SearchState = {
  search: null,
  loading: false,
  error: null,
  searchQueryParam: '',

  entityLoading: false,
  entitySearch: null,
  entitySearchQueryParam: { term: '' },
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

      // Track search if term is long enough
      if (action?.payload?.length >= 3) {
        trackSearch({
          searchTerm: action.payload,
          // entityType undefined = searching all entities
        });
      }
    },
    searchQueried(state, action: PayloadAction<SearchModel>) {
      const searchResults = new SearchModel(action.payload);
      state.search = searchResults;
      state.loading = false;

      // Calculate total results
      const artistsCount = searchResults.artists?.length || 0;
      const placesCount = searchResults.places?.length || 0;
      const totalResults = artistsCount + placesCount;

      // Track search completion with results count
      if (state.searchQueryParam && state.searchQueryParam.length >= 3) {
        trackSearch({
          searchTerm: state.searchQueryParam,
          resultsCount: totalResults,
        });

        // Track if no results found
        if (totalResults === 0) {
          trackSearchNoResults({
            searchTerm: state.searchQueryParam,
          });
        }
      }
    },
    entityQuerySearch(state, action: PayloadAction<SearchQueryParams>) {
      state.entityLoading = true;
      state.error = null;
      state.entitySearch = null;
      state.entitySearchQueryParam = action?.payload;

      // Track entity-specific search
      if (action?.payload?.term && action.payload.term.length >= 3) {
        const entityTypeMap: Record<string, EntityType> = {
          artist: EntityType.ARTIST,
          artists: EntityType.ARTIST,
          place: EntityType.PLACE,
          places: EntityType.PLACE,
        };

        trackSearch({
          searchTerm: action.payload.term,
          entityType: action.payload.entity ? entityTypeMap[action.payload.entity.toLowerCase()] : undefined,
        });
      }
    },
    entitySearchQueried(state, action: PayloadAction<SearchModel>) {
      const searchResults = new SearchModel(action.payload);
      state.entitySearch = searchResults;
      const previousQuery = state.entitySearchQueryParam;
      state.entitySearchQueryParam = { term: '' };
      state.entityLoading = false;

      // Calculate results by entity type
      const artistsCount = searchResults.artists?.length || 0;
      const placesCount = searchResults.places?.length || 0;
      const totalResults = artistsCount + placesCount;

      // Track search results
      if (previousQuery?.term && previousQuery.term.length >= 3) {
        const entityTypeMap: Record<string, EntityType> = {
          artist: EntityType.ARTIST,
          artists: EntityType.ARTIST,
          place: EntityType.PLACE,
          places: EntityType.PLACE,
        };

        const entityType = previousQuery.entity ? entityTypeMap[previousQuery.entity.toLowerCase()] : undefined;

        trackSearch({
          searchTerm: previousQuery.term,
          entityType: entityType,
          resultsCount: totalResults,
        });

        // Track no results
        if (totalResults === 0) {
          trackSearchNoResults({
            searchTerm: previousQuery.term,
            entityType: entityType,
          });
        }
      }
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

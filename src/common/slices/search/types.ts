import { SearchModel } from '~/models/domain/search/search.model';

export enum SearchErrorType {
  RESPONSE_ERROR = 1,
}

export interface SearchState {
  search: SearchModel;
  loading: boolean;
  error: SearchErrorType | null;
  searchQueryParam?: string;
}

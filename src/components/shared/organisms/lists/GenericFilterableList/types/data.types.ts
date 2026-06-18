/**
 * Data Source Types for GenericFilterableList
 *
 * Defines types for data fetching, Redux integration,
 * and static data handling.
 */

/**
 * Parameters for fetch function
 */
export interface ListFetchParams {
  /** Current page (1-indexed) */
  page?: number;

  /** Items per page */
  perPage?: number;

  /** Active filters */
  filters?: Record<string, any>;

  /** Sort configuration */
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };

  /** Search query */
  search?: string;

  /** Additional custom params */
  [key: string]: any;
}

/**
 * Response from fetch function (for server pagination)
 */
export interface ListFetchResponse<T> {
  /** Items for current page */
  items: T[];

  /** Total number of items across all pages */
  total: number;

  /** Current page number */
  page: number;

  /** Items per page */
  perPage: number;

  /** Total number of pages */
  totalPages: number;

  /** Additional metadata */
  meta?: Record<string, any>;
}

/**
 * Redux slice configuration
 */
export interface ListReduxSliceConfig<T> {
  /**
   * Hook to access the Redux slice
   * Example: usePreBookingRequestsSlice
   */
  useSlice: () => {
    actions: Record<string, any>;
  };

  /**
   * Selector to get items from state
   * Example: (state) => state.prebookings.items
   */
  selectItems: (state: any) => T[];

  /**
   * Selector to get loading state
   * Example: (state) => state.prebookings.loading
   */
  selectLoading: (state: any) => boolean;

  /**
   * Selector to get error state (optional)
   * Example: (state) => state.prebookings.error
   */
  selectError?: (state: any) => any;

  /**
   * Selector to get total count for server pagination (optional)
   */
  selectTotal?: (state: any) => number;
}

/**
 * Data source configuration
 */
export interface ListDataSourceConfig<T> {
  // === Option 1: Redux ===
  /**
   * Redux slice configuration
   * Use this when data comes from Redux store
   */
  reduxSlice?: ListReduxSliceConfig<T>;

  // === Option 2: Custom Fetch Function ===
  /**
   * Custom fetch function
   * Use this for custom API calls or other data sources
   *
   * @param params - Fetch parameters
   * @returns Promise with items or full response (for server pagination)
   */
  fetchFunction?: (params: ListFetchParams) => Promise<T[] | ListFetchResponse<T>>;

  // === Option 3: Static Data ===
  /**
   * Static data array
   * Use this for hardcoded or pre-loaded data
   */
  data?: T[];

  // === Auto-fetch on Mount ===
  /**
   * Automatically fetch data when component mounts
   * Default: true for Redux and fetchFunction
   */
  autoFetch?: boolean;

  /**
   * Initial fetch params
   */
  initialParams?: Partial<ListFetchParams>;

  // === Refresh ===
  /**
   * Auto-refresh interval in milliseconds (optional)
   * Example: 30000 for refresh every 30 seconds
   */
  refreshInterval?: number;
}

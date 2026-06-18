/**
 * useListDataSource Hook
 *
 * Manages data loading from various sources (Redux, fetch, static).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListDataSourceConfig, ListFetchParams, ListFetchResponse } from '../types';

export interface UseListDataSourceProps<T> {
  /** Data source configuration */
  config: ListDataSourceConfig<T>;

  /** Fetch parameters (for fetchFunction) */
  fetchParams?: ListFetchParams;
}

export interface UseListDataSourceReturn<T> {
  /** Current data */
  data: T[];

  /** Loading state */
  loading: boolean;

  /** Error state */
  error: any;

  /** Total count (for server pagination) */
  total?: number;

  /** Reload/refresh data */
  reload: () => void;

  /** Manually set data (for static source) */
  setData: (data: T[]) => void;
}

/**
 * Hook to manage data source
 */
export const useListDataSource = <T,>({
  config,
  fetchParams,
}: UseListDataSourceProps<T>): UseListDataSourceReturn<T> => {
  const dispatch = useDispatch();

  // Local state for non-Redux sources
  const [localData, setLocalData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [total, setTotal] = useState<number | undefined>(undefined);

  // Ref to track if initial fetch has occurred
  const initialFetchDone = useRef(false);

  // Redux selectors (if using Redux)
  const reduxData = useSelector((state: any) => {
    if (!config.reduxSlice) return [];
    return config.reduxSlice.selectItems(state);
  });

  const reduxLoading = useSelector((state: any) => {
    if (!config.reduxSlice) return false;
    return config.reduxSlice.selectLoading(state);
  });

  const reduxError = useSelector((state: any) => {
    if (!config.reduxSlice?.selectError) return null;
    return config.reduxSlice.selectError(state);
  });

  const reduxTotal = useSelector((state: any) => {
    if (!config.reduxSlice?.selectTotal) return undefined;
    return config.reduxSlice.selectTotal(state);
  });

  // Redux actions
  const reduxActions = config.reduxSlice?.useSlice().actions;

  // Determine source type
  const sourceType = config.reduxSlice
    ? 'redux'
    : config.fetchFunction
    ? 'fetch'
    : 'static';

  // Fetch function for custom fetch
  const fetchData = useCallback(async () => {
    if (!config.fetchFunction) return;

    setLoading(true);
    setError(null);

    try {
      const result = await config.fetchFunction(fetchParams || {});

      // Check if result is full response or just items
      if (isFullResponse(result)) {
        setLocalData(result.items);
        setTotal(result.total);
      } else {
        setLocalData(result);
        setTotal(result.length);
      }
    } catch (err) {
      setError(err);
      setLocalData([]);
    } finally {
      setLoading(false);
    }
  }, [config.fetchFunction, fetchParams]);

  // Redux load function
  const loadReduxData = useCallback(() => {
    if (!reduxActions || !dispatch) return;

    // Dispatch loadItems action
    const loadAction = reduxActions.loadItems;
    if (loadAction) {
      dispatch(loadAction(config.initialParams || {}));
    }
  }, [reduxActions, dispatch, config.initialParams]);

  // Reload/refresh function
  const reload = useCallback(() => {
    if (sourceType === 'redux') {
      loadReduxData();
    } else if (sourceType === 'fetch') {
      fetchData();
    }
  }, [sourceType, loadReduxData, fetchData]);

  // Auto-fetch on mount (if enabled)
  useEffect(() => {
    const shouldAutoFetch = config.autoFetch !== false;

    if (!shouldAutoFetch || initialFetchDone.current) return;

    initialFetchDone.current = true;

    if (sourceType === 'redux') {
      loadReduxData();
    } else if (sourceType === 'fetch') {
      fetchData();
    } else if (sourceType === 'static' && config.data) {
      setLocalData(config.data);
      setTotal(config.data.length);
    }
  }, [sourceType, config.autoFetch, config.data, loadReduxData, fetchData]);

  // Auto-refresh interval (if configured)
  useEffect(() => {
    if (!config.refreshInterval) return;

    const interval = setInterval(reload, config.refreshInterval);
    return () => clearInterval(interval);
  }, [config.refreshInterval, reload]);

  // Refetch when params change (for fetch function)
  useEffect(() => {
    if (sourceType === 'fetch' && initialFetchDone.current) {
      fetchData();
    }
  }, [sourceType, fetchParams, fetchData]);

  // Return appropriate data based on source type
  const data = sourceType === 'redux' ? reduxData : localData;
  const isLoading = sourceType === 'redux' ? reduxLoading : loading;
  const currentError = sourceType === 'redux' ? reduxError : error;
  const currentTotal = sourceType === 'redux' ? reduxTotal : total;

  return {
    data,
    loading: isLoading,
    error: currentError,
    total: currentTotal,
    reload,
    setData: setLocalData,
  };
};

/**
 * Type guard to check if result is a full response
 */
function isFullResponse<T>(result: T[] | ListFetchResponse<T>): result is ListFetchResponse<T> {
  return (result as ListFetchResponse<T>).items !== undefined;
}

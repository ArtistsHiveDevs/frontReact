/**
 * useListSorting Hook
 *
 * Manages sorting state and applies sorting to data.
 */

import { useState, useMemo, useCallback } from 'react';
import { ListSortingConfig, ListSortDirection, ListSortingState } from '../types';
import { applySorting } from '../utils/sortHelpers';

export interface UseListSortingProps<T> {
  /** Sorting configuration */
  sorting?: ListSortingConfig<T>;

  /** Data to sort */
  data: T[];

  /** Initial sort key */
  initialSortKey?: string;

  /** Initial sort direction */
  initialDirection?: ListSortDirection;
}

export interface UseListSortingReturn<T> {
  /** Current sorting state */
  sortingState: ListSortingState;

  /** Sorted data */
  sortedData: T[];

  /** Set sort by key */
  setSortKey: (key: string) => void;

  /** Toggle sort direction */
  toggleDirection: () => void;

  /** Set sort direction */
  setDirection: (direction: ListSortDirection) => void;

  /** Set both key and direction */
  setSort: (key: string, direction?: ListSortDirection) => void;

  /** Reset to default sort */
  resetSort: () => void;

  /** Current sort option config */
  currentSortOption: ListSortingConfig<T>['options'][number] | null;
}

/**
 * Hook to manage sorting
 */
export const useListSorting = <T,>({
  sorting,
  data,
  initialSortKey,
  initialDirection = 'asc',
}: UseListSortingProps<T>): UseListSortingReturn<T> => {
  // Determine default sort
  const defaultSortKey = initialSortKey || sorting?.defaultSort || null;
  const defaultDirection = initialDirection;

  // Sorting state
  const [sortingState, setSortingState] = useState<ListSortingState>({
    sortKey: defaultSortKey,
    direction: defaultDirection,
  });

  // Get current sort option config
  const currentSortOption = useMemo(() => {
    if (!sortingState.sortKey || !sorting) return null;
    return sorting.options.find(opt => opt.key === sortingState.sortKey) || null;
  }, [sorting, sortingState.sortKey]);

  // Set sort key
  const setSortKey = useCallback((key: string) => {
    setSortingState(prev => {
      // Find the sort option
      const option = sorting?.options.find(opt => opt.key === key);
      const newDirection = option?.direction || prev.direction;

      return {
        sortKey: key,
        direction: newDirection,
      };
    });
  }, [sorting]);

  // Toggle direction
  const toggleDirection = useCallback(() => {
    setSortingState(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Set direction
  const setDirection = useCallback((direction: ListSortDirection) => {
    setSortingState(prev => ({
      ...prev,
      direction,
    }));
  }, []);

  // Set both key and direction
  const setSort = useCallback((key: string, direction?: ListSortDirection) => {
    setSortingState({
      sortKey: key,
      direction: direction || 'asc',
    });
  }, []);

  // Reset to default
  const resetSort = useCallback(() => {
    setSortingState({
      sortKey: defaultSortKey,
      direction: defaultDirection,
    });
  }, [defaultSortKey, defaultDirection]);

  // Apply sorting to data
  const sortedData = useMemo(() => {
    if (!sorting || !sortingState.sortKey) return data;

    return applySorting(
      data,
      sorting.options,
      sortingState.sortKey,
      sortingState.direction
    );
  }, [data, sorting, sortingState]);

  return {
    sortingState,
    sortedData,
    setSortKey,
    toggleDirection,
    setDirection,
    setSort,
    resetSort,
    currentSortOption,
  };
};

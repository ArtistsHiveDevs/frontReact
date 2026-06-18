/**
 * useListFilters Hook
 *
 * Manages filter state and applies filters to data.
 */

import { useState, useMemo, useCallback } from 'react';
import { ListFilterConfig, ListFiltersState, ListFilterMetadata } from '../types';
import { applyFilters } from '../utils/filterHelpers';

export interface UseListFiltersProps<T> {
  /** Filter configurations */
  filters?: ListFilterConfig<T>[];

  /** Data to filter */
  data: T[];

  /** Current user for conditional filters */
  currentUser?: any;

  /** Initial filter values */
  initialFilters?: ListFiltersState;
}

export interface UseListFiltersReturn<T> {
  /** Current filter values */
  filtersState: ListFiltersState;

  /** Filtered data */
  filteredData: T[];

  /** Set a single filter value */
  setFilter: (key: string, value: any) => void;

  /** Set multiple filters at once */
  setFilters: (filters: Partial<ListFiltersState>) => void;

  /** Reset all filters to default */
  resetFilters: () => void;

  /** Reset a single filter */
  resetFilter: (key: string) => void;

  /** Get active filters metadata */
  activeFilters: ListFilterMetadata[];

  /** Check if any filter is active */
  hasActiveFilters: boolean;

  /** Count of active filters */
  activeFilterCount: number;
}

/**
 * Hook to manage filters
 */
export const useListFilters = <T,>({
  filters = [],
  data,
  currentUser,
  initialFilters = {},
}: UseListFiltersProps<T>): UseListFiltersReturn<T> => {
  // Get default values from filter configs
  const defaultFilters = useMemo(() => {
    const defaults: ListFiltersState = {};
    filters.forEach(filter => {
      if (filter.defaultValue !== undefined) {
        defaults[filter.key] = filter.defaultValue;
      }
    });
    return { ...defaults, ...initialFilters };
  }, [filters, initialFilters]);

  // Filter state
  const [filtersState, setFiltersState] = useState<ListFiltersState>(defaultFilters);

  // Set a single filter
  const setFilter = useCallback((key: string, value: any) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Set multiple filters
  const setFilters = useCallback((newFilters: Partial<ListFiltersState>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, [defaultFilters]);

  // Reset single filter
  const resetFilter = useCallback((key: string) => {
    setFiltersState(prev => {
      const newState = { ...prev };
      const filterConfig = filters.find(f => f.key === key);

      if (filterConfig?.defaultValue !== undefined) {
        newState[key] = filterConfig.defaultValue;
      } else {
        delete newState[key];
      }

      return newState;
    });
  }, [filters]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return applyFilters(data, filters, filtersState, currentUser);
  }, [data, filters, filtersState, currentUser]);

  // Get active filters metadata
  const activeFilters = useMemo((): ListFilterMetadata[] => {
    return filters
      .map(filter => {
        const value = filtersState[filter.key];
        const isActive = isFilterActive(filter, value);

        return {
          key: filter.key,
          label: filter.label,
          value,
          isActive,
        };
      })
      .filter(f => f.isActive);
  }, [filters, filtersState]);

  // Check if any filter is active
  const hasActiveFilters = activeFilters.length > 0;
  const activeFilterCount = activeFilters.length;

  return {
    filtersState,
    filteredData,
    setFilter,
    setFilters,
    resetFilters,
    resetFilter,
    activeFilters,
    hasActiveFilters,
    activeFilterCount,
  };
};

/**
 * Check if a filter value is considered "active"
 */
function isFilterActive(filter: ListFilterConfig, value: any): boolean {
  if (value === undefined || value === null) return false;

  switch (filter.type) {
    case 'text':
      return typeof value === 'string' && value.trim() !== '';

    case 'select':
      return value !== '' && value !== filter.defaultValue;

    case 'multiSelect':
    case 'chips':
      return Array.isArray(value) && value.length > 0;

    case 'dateRange':
      return value && (value.from !== null || value.to !== null);

    case 'date':
      return value !== null;

    case 'boolean':
      return value !== false && value !== filter.defaultValue;

    case 'number':
      return value !== 0 && value !== filter.defaultValue;

    case 'numberRange':
      return value && (value.min !== filter.min || value.max !== filter.max);

    case 'autocomplete':
      return value !== null && value !== '';

    default:
      return value !== filter.defaultValue;
  }
}

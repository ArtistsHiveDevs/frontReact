/**
 * useListSearch Hook
 *
 * Manages search state with debounce for text filtering.
 * Searches across multiple fields including nested paths.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from '../utils/commonHelpers';
import { getNestedValue } from '../utils/commonHelpers';

export interface UseListSearchProps<T> {
  /** Data to search through */
  data: T[];

  /** Fields to search in (supports nested paths like 'user.name') */
  searchFields: string[];

  /** Debounce delay in milliseconds */
  debounceDelay?: number;

  /** Case sensitive search */
  caseSensitive?: boolean;

  /** Initial search value */
  initialValue?: string;

  /** Callback when search changes */
  onSearchChange?: (searchTerm: string) => void;
}

export interface UseListSearchReturn<T> {
  /** Current search term (debounced) */
  searchTerm: string;

  /** Current input value (immediate) */
  searchInput: string;

  /** Filtered data based on search */
  searchedData: T[];

  /** Set search input */
  setSearchInput: (value: string) => void;

  /** Clear search */
  clearSearch: () => void;

  /** Whether search is active */
  hasSearch: boolean;

  /** Number of results */
  resultCount: number;
}

/**
 * Hook for managing search with debounce
 */
export function useListSearch<T>({
  data,
  searchFields,
  debounceDelay = 300,
  caseSensitive = false,
  initialValue = '',
  onSearchChange,
}: UseListSearchProps<T>): UseListSearchReturn<T> {
  // Immediate input value (what user types)
  const [searchInput, setSearchInput] = useState(initialValue);

  // Debounced search term (used for filtering)
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Debounced setter
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => {
      setSearchTerm(value);
      onSearchChange?.(value);
    }, debounceDelay),
    [debounceDelay, onSearchChange]
  );

  // Update debounced search term when input changes
  useEffect(() => {
    debouncedSetSearchTerm(searchInput);
  }, [searchInput, debouncedSetSearchTerm]);

  // Filter data based on search term
  const searchedData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase();

    return data.filter((item) => {
      // Search in all specified fields
      for (const field of searchFields) {
        const fieldValue = getNestedValue(item, field);

        if (fieldValue === undefined || fieldValue === null) {
          continue;
        }

        // Convert to string
        let stringValue = String(fieldValue);

        if (!caseSensitive) {
          stringValue = stringValue.toLowerCase();
        }

        // Check if it includes the search term
        if (stringValue.includes(searchValue)) {
          return true;
        }

        // Special handling for arrays (e.g., tags, categories)
        if (Array.isArray(fieldValue)) {
          const arrayMatch = fieldValue.some((val) => {
            const strVal = caseSensitive ? String(val) : String(val).toLowerCase();
            return strVal.includes(searchValue);
          });

          if (arrayMatch) {
            return true;
          }
        }
      }

      return false;
    });
  }, [data, searchTerm, searchFields, caseSensitive]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchTerm('');
    onSearchChange?.('');
  }, [onSearchChange]);

  return {
    searchTerm,
    searchInput,
    searchedData,
    setSearchInput,
    clearSearch,
    hasSearch: searchTerm.trim().length > 0,
    resultCount: searchedData.length,
  };
}

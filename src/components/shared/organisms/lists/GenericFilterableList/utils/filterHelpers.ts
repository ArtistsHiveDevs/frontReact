/**
 * Filter Helper Functions
 *
 * Utilities for applying filters to data arrays.
 */

import { ListFilterConfig, ListFiltersState } from '../types';
import { getNestedValue } from './commonHelpers';

/**
 * Apply all filters to a data array
 *
 * @param data - Data to filter
 * @param filterConfigs - Filter configurations
 * @param filtersState - Current filter values
 * @param currentUser - Current user for conditional filters
 * @returns Filtered data
 */
export function applyFilters<T>(
  data: T[],
  filterConfigs: ListFilterConfig<T>[],
  filtersState: ListFiltersState,
  currentUser?: any
): T[] {
  let filtered = [...data];

  filterConfigs.forEach(filterConfig => {
    const filterValue = filtersState[filterConfig.key];

    // Skip if filter has no value or is default
    if (filterValue === undefined || filterValue === null) return;
    if (filterValue === filterConfig.defaultValue) return;

    // Use custom filter function if provided
    if (filterConfig.filterFunction) {
      filtered = filtered.filter(item =>
        filterConfig.filterFunction!(item, filterValue, currentUser)
      );
      return;
    }

    // Apply default filtering logic based on type
    filtered = filtered.filter(item => {
      switch (filterConfig.type) {
        case 'text':
          return applyTextFilter(item, filterValue, filterConfig.searchFields || []);

        case 'select':
          return applySelectFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        case 'multiSelect':
          return applyMultiSelectFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        case 'dateRange':
          return applyDateRangeFilter(item, filterValue, filterConfig.targetField!);

        case 'date':
          return applyDateFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        case 'boolean':
          return applyBooleanFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        case 'numberRange':
          return applyNumberRangeFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        case 'number':
          return applyNumberFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        case 'chips':
          return applyChipsFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        case 'autocomplete':
          return applyAutocompleteFilter(item, filterValue, filterConfig.targetField || filterConfig.key);

        default:
          return true;
      }
    });
  });

  return filtered;
}

/**
 * Text filter - searches in multiple fields
 */
function applyTextFilter<T>(item: T, searchText: string, searchFields: string[]): boolean {
  if (!searchText || searchText.trim() === '') return true;

  const lowerSearch = searchText.toLowerCase();

  return searchFields.some(fieldPath => {
    const value = getNestedValue(item, fieldPath);

    if (value === null || value === undefined) return false;

    // Handle arrays (search in all array elements)
    if (Array.isArray(value)) {
      return value.some(v => {
        const str = String(v).toLowerCase();
        return str.includes(lowerSearch);
      });
    }

    // Handle objects
    if (typeof value === 'object') {
      const str = JSON.stringify(value).toLowerCase();
      return str.includes(lowerSearch);
    }

    // Handle primitives
    const str = String(value).toLowerCase();
    return str.includes(lowerSearch);
  });
}

/**
 * Select filter - exact match
 */
function applySelectFilter<T>(item: T, selectedValue: any, field: string): boolean {
  if (selectedValue === '' || selectedValue === 'all') return true;

  const value = getNestedValue(item, field);
  return value === selectedValue;
}

/**
 * MultiSelect filter - item must match at least one selected value
 */
function applyMultiSelectFilter<T>(item: T, selectedValues: any[], field: string): boolean {
  if (!Array.isArray(selectedValues) || selectedValues.length === 0) return true;

  const value = getNestedValue(item, field);

  // If item value is array, check if any item value is in selected values
  if (Array.isArray(value)) {
    return value.some(v => selectedValues.includes(v));
  }

  // Otherwise, check if item value is in selected values
  return selectedValues.includes(value);
}

/**
 * Date range filter
 */
function applyDateRangeFilter<T>(item: T, range: { from: Date | null; to: Date | null }, field: string): boolean {
  if (!range || (!range.from && !range.to)) return true;

  const value = getNestedValue(item, field);
  if (!value) return false;

  const itemDate = value instanceof Date ? value : new Date(value);

  if (range.from && range.to) {
    return itemDate >= range.from && itemDate <= range.to;
  } else if (range.from) {
    return itemDate >= range.from;
  } else if (range.to) {
    return itemDate <= range.to;
  }

  return true;
}

/**
 * Single date filter
 */
function applyDateFilter<T>(item: T, filterDate: Date, field: string): boolean {
  if (!filterDate) return true;

  const value = getNestedValue(item, field);
  if (!value) return false;

  const itemDate = value instanceof Date ? value : new Date(value);
  const compareDate = filterDate instanceof Date ? filterDate : new Date(filterDate);

  // Compare only dates (ignore time)
  return (
    itemDate.getFullYear() === compareDate.getFullYear() &&
    itemDate.getMonth() === compareDate.getMonth() &&
    itemDate.getDate() === compareDate.getDate()
  );
}

/**
 * Boolean filter
 */
function applyBooleanFilter<T>(item: T, filterValue: boolean, field: string): boolean {
  if (filterValue === false) return true; // Don't filter if false

  const value = getNestedValue(item, field);
  return Boolean(value) === filterValue;
}

/**
 * Number range filter
 */
function applyNumberRangeFilter<T>(item: T, range: { min: number; max: number }, field: string): boolean {
  if (!range) return true;

  const value = getNestedValue(item, field);
  if (value === null || value === undefined) return false;

  const numValue = Number(value);
  return numValue >= range.min && numValue <= range.max;
}

/**
 * Number filter - exact match
 */
function applyNumberFilter<T>(item: T, filterValue: number, field: string): boolean {
  if (filterValue === 0) return true;

  const value = getNestedValue(item, field);
  return Number(value) === Number(filterValue);
}

/**
 * Chips filter - similar to multiSelect
 */
function applyChipsFilter<T>(item: T, selectedChips: any[], field: string): boolean {
  return applyMultiSelectFilter(item, selectedChips, field);
}

/**
 * Autocomplete filter
 */
function applyAutocompleteFilter<T>(item: T, filterValue: any, field: string): boolean {
  if (!filterValue) return true;

  const value = getNestedValue(item, field);

  // Handle object values (autocomplete might return objects)
  if (typeof filterValue === 'object' && filterValue.value !== undefined) {
    return value === filterValue.value;
  }

  return value === filterValue;
}

/**
 * Sort Helper Functions
 *
 * Utilities for sorting data arrays.
 */

import { ListSortOption, ListSortDirection } from '../types';
import { getNestedValue } from './commonHelpers';

/**
 * Apply sorting to a data array
 *
 * @param data - Data to sort
 * @param sortOptions - Available sort options
 * @param sortKey - Current sort key
 * @param direction - Sort direction
 * @returns Sorted data
 */
export function applySorting<T>(
  data: T[],
  sortOptions: ListSortOption<T>[],
  sortKey: string,
  direction: ListSortDirection
): T[] {
  const sortOption = sortOptions.find(opt => opt.key === sortKey);
  if (!sortOption) return data;

  const sorted = [...data];

  // Use custom comparator if provided
  if (sortOption.comparator) {
    sorted.sort((a, b) => {
      const result = sortOption.comparator!(a, b);
      return direction === 'asc' ? result : -result;
    });
    return sorted;
  }

  // Use field-based sorting
  if (sortOption.field) {
    sorted.sort((a, b) => {
      const valueA = getNestedValue(a, sortOption.field!);
      const valueB = getNestedValue(b, sortOption.field!);

      const result = compareValues(valueA, valueB, sortOption.dataType);
      return direction === 'asc' ? result : -result;
    });
    return sorted;
  }

  return sorted;
}

/**
 * Compare two values based on data type
 *
 * @param a - First value
 * @param b - Second value
 * @param dataType - Data type hint
 * @returns Comparison result (-1, 0, 1)
 */
function compareValues(a: any, b: any, dataType?: 'string' | 'number' | 'date' | 'boolean'): number {
  // Handle null/undefined
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1;
  if (b === null || b === undefined) return -1;

  // Use dataType hint if provided
  if (dataType) {
    switch (dataType) {
      case 'string':
        return compareStrings(a, b);
      case 'number':
        return compareNumbers(a, b);
      case 'date':
        return compareDates(a, b);
      case 'boolean':
        return compareBooleans(a, b);
    }
  }

  // Auto-detect type
  if (typeof a === 'string' && typeof b === 'string') {
    return compareStrings(a, b);
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return compareNumbers(a, b);
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return compareBooleans(a, b);
  }

  if (a instanceof Date && b instanceof Date) {
    return compareDates(a, b);
  }

  // Check if values are date-like strings
  if (isDateString(a) && isDateString(b)) {
    return compareDates(new Date(a), new Date(b));
  }

  // Default: convert to string and compare
  return compareStrings(String(a), String(b));
}

/**
 * Compare strings (case-insensitive)
 */
function compareStrings(a: string, b: string): number {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

/**
 * Compare numbers
 */
function compareNumbers(a: number, b: number): number {
  return a - b;
}

/**
 * Compare dates
 */
function compareDates(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

/**
 * Compare booleans
 */
function compareBooleans(a: boolean, b: boolean): number {
  return (a === b) ? 0 : a ? 1 : -1;
}

/**
 * Check if a string is a date string
 */
function isDateString(value: any): boolean {
  if (typeof value !== 'string') return false;

  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
}

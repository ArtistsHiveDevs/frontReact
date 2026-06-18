/**
 * Sorting Types for GenericFilterableList
 *
 * Defines sorting configuration and options.
 */

/**
 * Sort direction
 */
export type ListSortDirection = 'asc' | 'desc';

/**
 * Sort option configuration
 */
export interface ListSortOption<T = any> {
  /** Unique key for this sort option */
  key: string;

  /** Display label */
  label: string;

  /** Field to sort by (can be nested path like 'user.name') */
  field?: string;

  /** Default sort direction */
  direction?: ListSortDirection;

  /**
   * Custom comparator function
   * If provided, takes precedence over field sorting
   *
   * @param a - First item
   * @param b - Second item
   * @returns Negative if a < b, positive if a > b, 0 if equal
   */
  comparator?: (a: T, b: T) => number;

  /** Icon for this sort option (optional) */
  icon?: string;

  /** Data type hint for better default sorting */
  dataType?: 'string' | 'number' | 'date' | 'boolean';
}

/**
 * Sorting configuration
 */
export interface ListSortingConfig<T = any> {
  /** Default sort option key */
  defaultSort?: string;

  /** Available sort options */
  options: ListSortOption<T>[];

  /** Allow toggling direction (asc/desc) */
  allowToggle?: boolean;

  /** Show direction indicator (↑↓) */
  showDirection?: boolean;

  /** Custom class name */
  className?: string;
}

/**
 * Current sorting state
 */
export interface ListSortingState {
  /** Currently active sort key */
  sortKey: string | null;

  /** Current sort direction */
  direction: ListSortDirection;
}

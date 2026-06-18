/**
 * Pagination Types for GenericFilterableList
 *
 * Defines pagination modes and configuration.
 */

/**
 * Pagination mode
 */
export type ListPaginationMode =
  | 'client'  // Client-side pagination (all data in memory)
  | 'server'  // Server-side pagination (fetch per page)
  | 'none';   // No pagination

/**
 * Pagination configuration
 */
export interface ListPaginationConfig {
  /** Pagination mode */
  mode: ListPaginationMode;

  /** Default items per page */
  defaultPerPage?: number;

  /** Available items per page options */
  options?: number[];

  /** Show page info (e.g., "1-20 / 100") */
  showPageInfo?: boolean;

  /** Show first/last page buttons */
  showFirstLast?: boolean;

  /** Show items per page selector */
  showPerPageSelector?: boolean;

  /** Position of pagination controls */
  position?: 'top' | 'bottom' | 'both';

  /** Compact mode (smaller controls) */
  compact?: boolean;

  /** Custom class name */
  className?: string;
}

/**
 * Pagination state
 */
export interface ListPaginationState {
  /** Current page (1-indexed) */
  currentPage: number;

  /** Items per page */
  itemsPerPage: number;

  /** Total number of items */
  totalItems: number;

  /** Total number of pages */
  totalPages: number;

  /** Index of first item on current page (0-indexed) */
  startIndex: number;

  /** Index of last item on current page (0-indexed, inclusive) */
  endIndex: number;
}

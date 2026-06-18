/**
 * Main Configuration Type for GenericFilterableList
 *
 * Combines all configuration types into a single config interface.
 */

import { ListDataSourceConfig } from './data.types';
import { ListFilterConfig } from './filter.types';
import { ListSortingConfig } from './sorting.types';
import { ListViewConfig } from './view.types';
import { ListActionConfig, ListBulkActionsConfig } from './action.types';
import { ListPaginationConfig } from './pagination.types';
import { ListUIConfig } from './ui.types';

/**
 * Complete configuration for GenericFilterableList component
 *
 * @template T - The type of items in the list
 */
export interface GenericFilterableListConfig<T> {
  // === Data Source (Required) ===
  /**
   * Data source configuration
   * Can be Redux, custom fetch function, or static data
   */
  dataSource: ListDataSourceConfig<T>;

  // === Filters ===
  /**
   * Filter configurations
   * Array of filter definitions
   */
  filters?: ListFilterConfig<T>[];

  // === Sorting ===
  /**
   * Sorting configuration
   * Defines available sort options
   */
  sorting?: ListSortingConfig<T>;

  // === Views (Required) ===
  /**
   * View configuration
   * Must specify at least one view mode
   */
  views: ListViewConfig<T>;

  // === Actions ===
  /**
   * Individual item actions (edit, delete, etc.)
   */
  actions?: ListActionConfig<T>[];

  /**
   * Bulk actions configuration
   */
  bulkActions?: ListBulkActionsConfig<T>;

  // === Pagination ===
  /**
   * Pagination configuration
   * Default: client-side, 20 per page
   */
  pagination?: ListPaginationConfig;

  // === UI ===
  /**
   * UI configuration (title, tabs, empty states, etc.)
   */
  ui?: ListUIConfig<T>;

  // === Advanced Options ===
  /**
   * Preserve filter/sort state in localStorage
   */
  persistState?: boolean;

  /**
   * LocalStorage key for state persistence
   */
  persistStateKey?: string;

  /**
   * Enable URL synchronization for filters
   */
  syncWithURL?: boolean;

  /**
   * Custom class name for root container
   */
  className?: string;

  /**
   * Test ID for testing
   */
  testId?: string;
}

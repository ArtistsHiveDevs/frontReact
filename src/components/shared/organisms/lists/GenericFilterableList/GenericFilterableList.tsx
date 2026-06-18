/**
 * GenericFilterableList Component
 *
 * Main orchestrator component for filterable, sortable, paginated lists.
 * Supports multiple view modes (cards, table, grid, kanban) and various
 * filter types.
 */

import React, { useMemo } from 'react';
import { GenericFilterableListConfig } from './types';
import { useListDataSource } from './hooks/useListDataSource';
import { useListFilters } from './hooks/useListFilters';
import { useListSorting } from './hooks/useListSorting';
import { useListPagination } from './hooks/useListPagination';

export interface GenericFilterableListProps<T> {
  /** Complete configuration for the list */
  config: GenericFilterableListConfig<T>;

  /** Current logged-in user (for conditional filters/actions) */
  currentUser?: any;

  /** Callback when an item is clicked */
  onItemClick?: (item: T) => void;

  /** Additional className for root container */
  className?: string;

  /** Test ID for testing */
  testId?: string;
}

/**
 * Generic Filterable List Component
 *
 * @template T - The type of items in the list
 */
export function GenericFilterableList<T>({
  config,
  currentUser,
  onItemClick,
  className = '',
  testId,
}: GenericFilterableListProps<T>) {
  // ========== DATA SOURCE ==========
  const {
    data: sourceData,
    loading: dataLoading,
    error: dataError,
    total: serverTotal,
    reload,
  } = useListDataSource<T>({
    config: config.dataSource,
    fetchParams: {}, // TODO: will include filters, sort, pagination
  });

  // ========== FILTERS ==========
  const {
    filtersState,
    filteredData,
    setFilter,
    setFilters,
    resetFilters,
    resetFilter,
    activeFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useListFilters<T>({
    filters: config.filters,
    data: sourceData,
    currentUser,
  });

  // ========== SORTING ==========
  const {
    sortingState,
    sortedData,
    setSortKey,
    toggleDirection,
    setDirection,
    setSort,
    resetSort,
    currentSortOption,
  } = useListSorting<T>({
    sorting: config.sorting,
    data: filteredData,
  });

  // ========== PAGINATION ==========
  const paginationMode = config.pagination?.mode || 'client';
  const totalItems = paginationMode === 'server' ? (serverTotal || 0) : sortedData.length;

  const {
    paginationState,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setItemsPerPage,
    canGoPrevious,
    canGoNext,
  } = useListPagination({
    config: config.pagination,
    totalItems,
    data: sortedData,
    onPageChange: (page, perPage) => {
      // TODO: For server pagination, trigger new fetch
      if (paginationMode === 'server') {
        reload();
      }
    },
  });

  // Final data to display
  const displayData = paginationMode === 'none' ? sortedData : paginatedData;

  // ========== VIEW STATE ==========
  const [currentViewMode, setCurrentViewMode] = React.useState(config.views.default);

  // ========== RENDER ==========
  const rootClassName = `generic-filterable-list ${className} ${config.className || ''}`.trim();

  return (
    <div className={rootClassName} data-testid={testId || config.testId}>
      {/* TODO: Render components in Sprint 4 */}
      <div className="gfl-container">
        {/* Header */}
        <div className="gfl-header">
          <h2>GenericFilterableList - Sprint 1 Complete</h2>
          <p>Config loaded: {config.ui?.title || 'No title'}</p>
        </div>

        {/* Stats */}
        <div className="gfl-stats">
          <div>
            <strong>Total Items:</strong> {sourceData.length}
          </div>
          <div>
            <strong>Filtered:</strong> {filteredData.length}
          </div>
          <div>
            <strong>Sorted:</strong> {sortedData.length}
          </div>
          <div>
            <strong>Displayed:</strong> {displayData.length}
          </div>
          <div>
            <strong>Active Filters:</strong> {activeFilterCount}
          </div>
          <div>
            <strong>Loading:</strong> {dataLoading ? 'Yes' : 'No'}
          </div>
        </div>

        {/* Loading State */}
        {dataLoading && (
          <div className="gfl-loading">
            Loading...
          </div>
        )}

        {/* Error State */}
        {dataError && (
          <div className="gfl-error">
            Error: {dataError.message || 'An error occurred'}
          </div>
        )}

        {/* Empty State */}
        {!dataLoading && displayData.length === 0 && (
          <div className="gfl-empty">
            {hasActiveFilters
              ? 'No results found with current filters'
              : config.ui?.emptyState?.title || 'No items to display'}
          </div>
        )}

        {/* Data Preview (temporary for Sprint 1) */}
        {!dataLoading && displayData.length > 0 && (
          <div className="gfl-preview">
            <h3>Data Preview ({displayData.length} items)</h3>
            <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(displayData.slice(0, 3), null, 2)}
            </pre>
          </div>
        )}

        {/* Pagination Info */}
        {paginationMode !== 'none' && (
          <div className="gfl-pagination-info">
            <p>
              Page {paginationState.currentPage} of {paginationState.totalPages}
              {' - '}
              Items {paginationState.startIndex + 1} to {paginationState.endIndex + 1} of {paginationState.totalItems}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenericFilterableList;

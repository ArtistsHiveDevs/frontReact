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
import { ListHeader } from './components/ListHeader';
import { ListFiltersBar } from './components/ListFiltersBar';
import { ListViewModeToggle } from './components/ListViewModeToggle';
import { ListSortSelector } from './components/ListSortSelector';
import { ListCardView } from './views/ListCardView';
import { ListTableView } from './views/ListTableView';
import { ListPagination } from './components/ListPagination';
import { ListEmptyState } from './components/ListEmptyState';
import { ListLoadingState } from './components/ListLoadingState';

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
    fetchParams: {}, // TODO: will include filters, sort, pagination for server-side
  });

  // ========== FILTERS ==========
  const {
    filtersState,
    filteredData,
    setFilter,
    resetFilters,
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

  // Get available view modes
  const availableViewModes = useMemo(() => {
    const modes: Array<'cards' | 'table' | 'grid' | 'kanban'> = [];
    if (config.views.cards) modes.push('cards');
    if (config.views.table) modes.push('table');
    if (config.views.grid) modes.push('grid');
    if (config.views.kanban) modes.push('kanban');
    return modes;
  }, [config.views]);

  // ========== RENDER HELPERS ==========

  // Render view based on current mode
  const renderView = () => {
    if (dataLoading && !config.ui?.loadingState?.useSkeleton) {
      return <ListLoadingState config={config.ui?.loadingState} />;
    }

    if (dataError) {
      return (
        <div className="gfl__error" role="alert">
          <strong>Error:</strong> {dataError.message || 'An error occurred loading data'}
        </div>
      );
    }

    if (displayData.length === 0) {
      return (
        <ListEmptyState
          config={hasActiveFilters ? config.ui?.noResultsState : config.ui?.emptyState}
          variant={hasActiveFilters ? 'no-results' : 'empty'}
        />
      );
    }

    // Render appropriate view
    switch (currentViewMode) {
      case 'cards':
        if (!config.views.cards) return null;
        return (
          <ListCardView<T>
            config={config.views.cards}
            data={displayData}
            onItemClick={onItemClick}
            loading={dataLoading}
          />
        );

      case 'table':
        if (!config.views.table) return null;
        return (
          <ListTableView<T>
            config={config.views.table}
            data={displayData}
            onItemClick={onItemClick}
            sortState={{
              key: sortingState.sortKey || '',
              direction: sortingState.direction,
            }}
            onColumnSort={setSortKey}
            loading={dataLoading}
          />
        );

      case 'grid':
        // TODO: Implement in Sprint 9
        return (
          <div className="gfl__placeholder">
            Grid view - Coming in Sprint 9
          </div>
        );

      case 'kanban':
        // TODO: Implement in Sprint 9
        return (
          <div className="gfl__placeholder">
            Kanban view - Coming in Sprint 9
          </div>
        );

      default:
        return null;
    }
  };

  // Render header actions (view toggle + sort selector)
  const renderHeaderActions = () => (
    <div className="gfl__header-actions">
      {/* Sort Selector */}
      {config.sorting && config.sorting.options.length > 0 && (
        <ListSortSelector
          options={config.sorting.options}
          currentSortKey={sortingState.sortKey}
          currentDirection={sortingState.direction}
          onSortChange={setSortKey}
          onDirectionToggle={toggleDirection}
          compact={true}
        />
      )}

      {/* View Mode Toggle */}
      {availableViewModes.length > 1 && (
        <ListViewModeToggle
          currentMode={currentViewMode}
          availableModes={availableViewModes}
          onModeChange={setCurrentViewMode}
        />
      )}
    </div>
  );

  // Render filters bar
  const renderFiltersBar = () => {
    if (!config.filters || config.filters.length === 0) return null;

    return (
      <ListFiltersBar<T>
        filters={config.filters}
        filtersState={filtersState}
        onFilterChange={setFilter}
        onResetFilters={resetFilters}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        layout="horizontal"
        collapsible={true}
        initiallyCollapsed={false}
      />
    );
  };

  // ========== MAIN RENDER ==========
  const rootClassName = `generic-filterable-list ${className} ${config.className || ''}`.trim();

  return (
    <div className={rootClassName} data-testid={testId || config.testId}>
      {/* Header */}
      <ListHeader
        title={config.ui?.title}
        subtitle={config.ui?.subtitle}
        icon={config.ui?.icon}
        customComponent={config.ui?.headerComponent}
        actions={renderHeaderActions()}
        filterBar={renderFiltersBar()}
      />

      {/* Main Content */}
      <div className="gfl__content">
        {renderView()}
      </div>

      {/* Pagination */}
      {paginationMode !== 'none' && displayData.length > 0 && (
        <ListPagination
          paginationState={paginationState}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          itemsPerPageOptions={config.pagination?.itemsPerPageOptions}
          showItemsPerPageSelector={config.pagination?.showItemsPerPageSelector !== false}
        />
      )}

      {/* Loading Overlay (if using skeleton in view) */}
      {dataLoading && config.ui?.loadingState?.overlay && (
        <ListLoadingState config={config.ui.loadingState} overlay={true} />
      )}
    </div>
  );
}

export default GenericFilterableList;

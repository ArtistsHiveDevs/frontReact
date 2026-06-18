/**
 * ListFiltersBar Component
 *
 * Container for all filters with:
 * - Renders all configured filters
 * - Active filters badges
 * - Collapsible/expandable layout
 * - Reset all filters button
 */

import React, { useState } from 'react';
import { ListFilterConfig } from '../types/filter.types';
import { ListFilterRenderer } from '../filters/ListFilterRenderer';

export interface ListFiltersBarProps<T> {
  /** Filter configurations */
  filters: ListFilterConfig<T>[];

  /** Current filters state */
  filtersState: Record<string, any>;

  /** Callback when a filter changes */
  onFilterChange: (key: string, value: any) => void;

  /** Callback to reset all filters */
  onResetFilters: () => void;

  /** Number of active filters */
  activeFilterCount: number;

  /** Whether any filter is active */
  hasActiveFilters: boolean;

  /** Layout mode */
  layout?: 'horizontal' | 'vertical' | 'grid';

  /** Collapsible filters */
  collapsible?: boolean;

  /** Initially collapsed */
  initiallyCollapsed?: boolean;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Show filter count badge */
  showFilterCount?: boolean;

  /** Show reset button */
  showResetButton?: boolean;
}

/**
 * Filters Bar Component
 */
export function ListFiltersBar<T>({
  filters,
  filtersState,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  hasActiveFilters,
  layout = 'horizontal',
  collapsible = false,
  initiallyCollapsed = false,
  className = '',
  testId,
  showFilterCount = true,
  showResetButton = true,
}: ListFiltersBarProps<T>) {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);

  // Filter out filters that should not be visible
  const visibleFilters = filters.filter((filter) => {
    if (!filter.showIf) return true;
    return filter.showIf(filtersState[filter.key]);
  });

  if (visibleFilters.length === 0) {
    return null;
  }

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`list-filters-bar list-filters-bar--${layout} ${className} ${
        isCollapsed ? 'list-filters-bar--collapsed' : ''
      }`}
      data-testid={testId || 'list-filters-bar'}
    >
      {/* Header with toggle and reset */}
      <div className="list-filters-bar__header">
        <div className="list-filters-bar__title">
          <span className="list-filters-bar__title-text">Filters</span>

          {/* Active filters count badge */}
          {showFilterCount && activeFilterCount > 0 && (
            <span
              className="list-filters-bar__count-badge"
              aria-label={`${activeFilterCount} active filters`}
            >
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="list-filters-bar__actions">
          {/* Reset all button */}
          {showResetButton && hasActiveFilters && (
            <button
              type="button"
              className="list-filters-bar__reset-btn"
              onClick={onResetFilters}
              aria-label="Reset all filters"
            >
              Reset All
            </button>
          )}

          {/* Collapse/Expand button */}
          {collapsible && (
            <button
              type="button"
              className="list-filters-bar__toggle-btn"
              onClick={handleToggleCollapse}
              aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      </div>

      {/* Filters container */}
      {!isCollapsed && (
        <div className={`list-filters-bar__filters list-filters-bar__filters--${layout}`}>
          {visibleFilters.map((filter) => (
            <div
              key={filter.key}
              className={`list-filters-bar__filter-item ${
                filter.alwaysVisible ? 'list-filters-bar__filter-item--always-visible' : ''
              }`}
            >
              <ListFilterRenderer<T>
                config={filter}
                value={filtersState[filter.key]}
                onChange={(value) => onFilterChange(filter.key, value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Active filters summary (when collapsed) */}
      {isCollapsed && hasActiveFilters && (
        <div className="list-filters-bar__summary">
          <span className="list-filters-bar__summary-text">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
          </span>
        </div>
      )}
    </div>
  );
}

export default ListFiltersBar;

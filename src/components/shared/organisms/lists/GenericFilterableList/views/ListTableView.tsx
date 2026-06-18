/**
 * ListTableView Component
 *
 * Table view with:
 * - Dynamic columns
 * - Sortable columns
 * - Custom cell rendering
 * - Row actions
 * - Sticky header optional
 * - Striped rows optional
 */

import React from 'react';
import { ListTableViewConfig, ListTableColumn } from '../types/view.types';
import { getNestedValue } from '../utils/commonHelpers';

export interface ListTableViewProps<T> {
  /** View configuration */
  config: ListTableViewConfig<T>;

  /** Data items to display */
  data: T[];

  /** Callback when item is clicked */
  onItemClick?: (item: T) => void;

  /** Current sort state */
  sortState?: {
    key: string;
    direction: 'asc' | 'desc';
  };

  /** Callback when column header is clicked (for sorting) */
  onColumnSort?: (key: string) => void;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Loading state */
  loading?: boolean;

  /** Items currently loading */
  loadingItems?: Set<string | number>;

  /** Get item ID for tracking */
  getItemId?: (item: T) => string | number;
}

/**
 * Table View Component
 */
export function ListTableView<T>({
  config,
  data,
  onItemClick,
  sortState,
  onColumnSort,
  className = '',
  testId,
  loading = false,
  loadingItems,
  getItemId,
}: ListTableViewProps<T>) {
  const columns = config.columns || [];

  // Check if item is loading
  const isItemLoading = (item: T): boolean => {
    if (!loadingItems || !getItemId) return false;
    return loadingItems.has(getItemId(item));
  };

  // Handle row click
  const handleRowClick = (item: T) => {
    if (config.onRowClick) {
      config.onRowClick(item);
    } else if (onItemClick) {
      onItemClick(item);
    }
  };

  // Handle column header click (sorting)
  const handleColumnHeaderClick = (column: ListTableColumn<T>) => {
    if (!column.sortable || !onColumnSort) return;
    onColumnSort(column.key);
  };

  // Render cell content
  const renderCell = (item: T, column: ListTableColumn<T>) => {
    // Custom render function
    if (column.render) {
      return column.render(item);
    }

    // Get value from item
    const value = getNestedValue(item, column.key);

    // Format if formatter provided
    if (column.formatter) {
      return column.formatter(value, item);
    }

    // Default: convert to string
    if (value === null || value === undefined) {
      return column.emptyValue || '-';
    }

    return String(value);
  };

  // Get sort indicator for column
  const getSortIndicator = (column: ListTableColumn<T>) => {
    if (!column.sortable) return null;
    if (!sortState || sortState.key !== column.key) {
      return <span className="list-table-view__sort-icon list-table-view__sort-icon--inactive">↕</span>;
    }

    return (
      <span className="list-table-view__sort-icon list-table-view__sort-icon--active">
        {sortState.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // If no data
  if (data.length === 0) {
    return (
      <div className={`list-table-view list-table-view--empty ${className}`}>
        <div className="list-table-view__empty">
          {config.emptyMessage || 'No items to display'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`list-table-view ${className} ${loading ? 'list-table-view--loading' : ''}`}
      data-testid={testId || 'list-table-view'}
    >
      <div className="list-table-view__wrapper">
        <table
          className={`list-table-view__table ${
            config.striped ? 'list-table-view__table--striped' : ''
          } ${config.stickyHeader ? 'list-table-view__table--sticky-header' : ''}`}
        >
          {/* Table Header */}
          <thead className="list-table-view__header">
            <tr className="list-table-view__header-row">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`list-table-view__header-cell ${
                    column.sortable ? 'list-table-view__header-cell--sortable' : ''
                  } ${column.align ? `list-table-view__header-cell--${column.align}` : ''}`}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                  onClick={() => handleColumnHeaderClick(column)}
                  role={column.sortable ? 'button' : undefined}
                  tabIndex={column.sortable ? 0 : undefined}
                  aria-sort={
                    sortState?.key === column.key
                      ? sortState.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className="list-table-view__header-content">
                    <span className="list-table-view__header-label">{column.label}</span>
                    {getSortIndicator(column)}
                  </div>
                </th>
              ))}

              {/* Actions column if configured */}
              {config.rowActions && (
                <th className="list-table-view__header-cell list-table-view__header-cell--actions">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="list-table-view__body">
            {data.map((item, index) => {
              const itemId = getItemId ? getItemId(item) : index;
              const itemLoading = isItemLoading(item);
              const isClickable = config.onRowClick || onItemClick;

              return (
                <tr
                  key={itemId}
                  className={`list-table-view__row ${
                    isClickable ? 'list-table-view__row--clickable' : ''
                  } ${itemLoading ? 'list-table-view__row--loading' : ''}`}
                  onClick={() => !itemLoading && isClickable && handleRowClick(item)}
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`list-table-view__cell ${
                        column.align ? `list-table-view__cell--${column.align}` : ''
                      }`}
                      style={{
                        width: column.width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                      }}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}

                  {/* Actions cell */}
                  {config.rowActions && (
                    <td className="list-table-view__cell list-table-view__cell--actions">
                      {config.rowActions.map((action, actionIndex) => {
                        // Check if action should be shown
                        if (action.showIf && !action.showIf(item)) {
                          return null;
                        }

                        const isDisabled = action.disabledIf && action.disabledIf(item);

                        return (
                          <button
                            key={actionIndex}
                            type="button"
                            className={`list-table-view__action-btn ${
                              action.variant ? `list-table-view__action-btn--${action.variant}` : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDisabled && !itemLoading) {
                                action.handler(item);
                              }
                            }}
                            disabled={isDisabled || itemLoading}
                            title={action.label}
                            aria-label={action.label}
                          >
                            {action.icon && <span className="list-table-view__action-icon">{action.icon}</span>}
                            {action.showLabel !== false && (
                              <span className="list-table-view__action-label">{action.label}</span>
                            )}
                          </button>
                        );
                      })}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Loading overlay */}
      {loading && config.showLoadingOverlay && (
        <div className="list-table-view__loading-overlay">
          <div className="list-table-view__loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default ListTableView;

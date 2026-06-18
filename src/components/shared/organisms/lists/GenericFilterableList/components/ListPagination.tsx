/**
 * ListPagination Component
 *
 * Pagination controls with:
 * - First, previous, next, last buttons
 * - Page number buttons with ellipsis
 * - Items per page selector
 * - Current range display (1-20 of 100)
 * - Compact mode
 */

import React from 'react';
import { ListPaginationState } from '../types/pagination.types';
import { getPageNumbers, getItemsRangeText } from '../utils/paginationHelpers';

export interface ListPaginationProps {
  /** Pagination state */
  paginationState: ListPaginationState;

  /** Callback to go to specific page */
  onPageChange: (page: number) => void;

  /** Callback to change items per page */
  onItemsPerPageChange?: (itemsPerPage: number) => void;

  /** Can go to previous page */
  canGoPrevious: boolean;

  /** Can go to next page */
  canGoNext: boolean;

  /** Items per page options */
  itemsPerPageOptions?: number[];

  /** Maximum page buttons to show */
  maxPageButtons?: number;

  /** Compact mode (no range text) */
  compact?: boolean;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Show items per page selector */
  showItemsPerPageSelector?: boolean;
}

/**
 * Pagination Component
 */
export const ListPagination: React.FC<ListPaginationProps> = ({
  paginationState,
  onPageChange,
  onItemsPerPageChange,
  canGoPrevious,
  canGoNext,
  itemsPerPageOptions = [10, 20, 50, 100],
  maxPageButtons = 7,
  compact = false,
  className = '',
  testId,
  showItemsPerPageSelector = true,
}) => {
  const { currentPage, totalPages, totalItems } = paginationState;

  // Get page numbers to display
  const pageNumbers = getPageNumbers(currentPage, totalPages, maxPageButtons);

  // Handle page button click
  const handlePageClick = (page: number | 'ellipsis') => {
    if (page === 'ellipsis') return;
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newValue);
    }
  };

  // Don't render if only 1 page and no items per page selector
  if (totalPages <= 1 && !showItemsPerPageSelector) {
    return null;
  }

  return (
    <div
      className={`list-pagination ${compact ? 'list-pagination--compact' : ''} ${className}`}
      data-testid={testId || 'list-pagination'}
    >
      {/* Items range text */}
      {!compact && (
        <div className="list-pagination__info">
          <span className="list-pagination__range-text">
            {getItemsRangeText(paginationState)}
          </span>
        </div>
      )}

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="list-pagination__controls">
          {/* First page button */}
          <button
            type="button"
            className="list-pagination__button list-pagination__button--first"
            onClick={() => handlePageClick(1)}
            disabled={!canGoPrevious}
            aria-label="First page"
            title="First page"
          >
            ««
          </button>

          {/* Previous page button */}
          <button
            type="button"
            className="list-pagination__button list-pagination__button--prev"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={!canGoPrevious}
            aria-label="Previous page"
            title="Previous page"
          >
            ‹
          </button>

          {/* Page number buttons */}
          <div className="list-pagination__pages">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="list-pagination__ellipsis"
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  className={`list-pagination__button list-pagination__button--page ${
                    isActive ? 'list-pagination__button--active' : ''
                  }`}
                  onClick={() => handlePageClick(page)}
                  disabled={isActive}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next page button */}
          <button
            type="button"
            className="list-pagination__button list-pagination__button--next"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={!canGoNext}
            aria-label="Next page"
            title="Next page"
          >
            ›
          </button>

          {/* Last page button */}
          <button
            type="button"
            className="list-pagination__button list-pagination__button--last"
            onClick={() => handlePageClick(totalPages)}
            disabled={!canGoNext}
            aria-label="Last page"
            title="Last page"
          >
            »»
          </button>
        </div>
      )}

      {/* Items per page selector */}
      {showItemsPerPageSelector && onItemsPerPageChange && (
        <div className="list-pagination__per-page">
          <label htmlFor="items-per-page" className="list-pagination__per-page-label">
            Items per page:
          </label>
          <select
            id="items-per-page"
            className="list-pagination__per-page-select"
            value={paginationState.itemsPerPage}
            onChange={handleItemsPerPageChange}
            aria-label="Items per page"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ListPagination;

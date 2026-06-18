/**
 * Pagination Helper Functions
 *
 * Utilities for pagination calculations and data slicing.
 */

import { ListPaginationState } from '../types';

/**
 * Calculate pagination state
 *
 * @param currentPage - Current page (1-indexed)
 * @param itemsPerPage - Items per page
 * @param totalItems - Total number of items
 * @returns Pagination state
 */
export function calculatePaginationState(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): ListPaginationState {
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page is valid
  const validPage = Math.max(1, Math.min(currentPage, totalPages));

  // Calculate indices (0-based)
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  return {
    currentPage: validPage,
    itemsPerPage,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
  };
}

/**
 * Paginate data array (client-side pagination)
 *
 * @param data - Data to paginate
 * @param startIndex - Start index (0-based, inclusive)
 * @param endIndex - End index (0-based, inclusive)
 * @returns Paginated data
 */
export function paginateData<T>(data: T[], startIndex: number, endIndex: number): T[] {
  if (!Array.isArray(data)) return [];
  if (data.length === 0) return [];

  return data.slice(startIndex, endIndex + 1);
}

/**
 * Get page numbers for pagination controls
 *
 * @param currentPage - Current page
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of page buttons to show
 * @returns Array of page numbers to display
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    // Show all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  let startPage = Math.max(2, currentPage - halfVisible);
  let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust if we're near the beginning
  if (currentPage <= halfVisible + 1) {
    endPage = maxVisible - 1;
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible) {
    startPage = totalPages - maxVisible + 2;
  }

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pages.push('ellipsis');
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Calculate items range text (e.g., "1-20 of 100")
 *
 * @param paginationState - Current pagination state
 * @returns Range text
 */
export function getItemsRangeText(paginationState: ListPaginationState): string {
  const { startIndex, endIndex, totalItems } = paginationState;

  if (totalItems === 0) {
    return '0 items';
  }

  const start = startIndex + 1; // Convert to 1-indexed
  const end = endIndex + 1; // Convert to 1-indexed

  if (start === end) {
    return `${start} of ${totalItems}`;
  }

  return `${start}-${end} of ${totalItems}`;
}

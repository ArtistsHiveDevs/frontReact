/**
 * useListPagination Hook
 *
 * Manages pagination state for both client and server modes.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ListPaginationConfig, ListPaginationMode, ListPaginationState } from '../types';
import { calculatePaginationState, paginateData } from '../utils/paginationHelpers';

export interface UseListPaginationProps {
  /** Pagination configuration */
  config?: ListPaginationConfig;

  /** Total number of items (for server pagination) */
  totalItems?: number;

  /** Data to paginate (for client pagination) */
  data?: any[];

  /** Initial page */
  initialPage?: number;

  /** Callback when page changes (for server pagination) */
  onPageChange?: (page: number, perPage: number) => void;
}

export interface UseListPaginationReturn {
  /** Current pagination state */
  paginationState: ListPaginationState;

  /** Paginated data (for client pagination only) */
  paginatedData: any[];

  /** Go to specific page */
  goToPage: (page: number) => void;

  /** Go to next page */
  nextPage: () => void;

  /** Go to previous page */
  previousPage: () => void;

  /** Go to first page */
  firstPage: () => void;

  /** Go to last page */
  lastPage: () => void;

  /** Change items per page */
  setItemsPerPage: (perPage: number) => void;

  /** Can go to previous page */
  canGoPrevious: boolean;

  /** Can go to next page */
  canGoNext: boolean;
}

const DEFAULT_ITEMS_PER_PAGE = 20;
const DEFAULT_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

/**
 * Hook to manage pagination
 */
export const useListPagination = ({
  config,
  totalItems = 0,
  data = [],
  initialPage = 1,
  onPageChange,
}: UseListPaginationProps): UseListPaginationReturn => {
  const mode: ListPaginationMode = config?.mode || 'client';
  const defaultPerPage = config?.defaultPerPage || DEFAULT_ITEMS_PER_PAGE;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(defaultPerPage);

  // Calculate total items based on mode
  const totalItemsCount = mode === 'client' ? data.length : totalItems;

  // Calculate pagination state
  const paginationState = useMemo((): ListPaginationState => {
    return calculatePaginationState(currentPage, itemsPerPage, totalItemsCount);
  }, [currentPage, itemsPerPage, totalItemsCount]);

  // Paginated data (client mode only)
  const paginatedData = useMemo(() => {
    if (mode !== 'client') return data;
    return paginateData(data, paginationState.startIndex, paginationState.endIndex);
  }, [mode, data, paginationState]);

  // Can navigate
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < paginationState.totalPages;

  // Go to specific page
  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, paginationState.totalPages));
    setCurrentPage(validPage);

    if (mode === 'server' && onPageChange) {
      onPageChange(validPage, itemsPerPage);
    }
  }, [paginationState.totalPages, mode, itemsPerPage, onPageChange]);

  // Navigation functions
  const nextPage = useCallback(() => {
    if (canGoNext) {
      goToPage(currentPage + 1);
    }
  }, [canGoNext, currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (canGoPrevious) {
      goToPage(currentPage - 1);
    }
  }, [canGoPrevious, currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(paginationState.totalPages);
  }, [goToPage, paginationState.totalPages]);

  // Change items per page
  const setItemsPerPage = useCallback((perPage: number) => {
    setItemsPerPageState(perPage);
    setCurrentPage(1); // Reset to first page

    if (mode === 'server' && onPageChange) {
      onPageChange(1, perPage);
    }
  }, [mode, onPageChange]);

  // Reset to first page when total items change significantly
  useEffect(() => {
    if (currentPage > paginationState.totalPages && paginationState.totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, paginationState.totalPages]);

  return {
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
  };
};

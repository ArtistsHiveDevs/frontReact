/**
 * GenericFilterableList Module
 *
 * Main export point for the Generic Filterable List system.
 */

// Main component
export { GenericFilterableList as default, GenericFilterableList } from './GenericFilterableList';
export type { GenericFilterableListProps } from './GenericFilterableList';

// All types
export * from './types';

// Hooks (for advanced usage)
export { useListFilters } from './hooks/useListFilters';
export { useListSorting } from './hooks/useListSorting';
export { useListPagination } from './hooks/useListPagination';
export { useListDataSource } from './hooks/useListDataSource';

// Utilities (for custom filters/sorting)
export * from './utils/filterHelpers';
export * from './utils/sortHelpers';
export * from './utils/paginationHelpers';
export * from './utils/commonHelpers';

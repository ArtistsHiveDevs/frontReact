/**
 * Filter Types for GenericFilterableList
 *
 * Defines all filter-related types including filter configurations,
 * filter types, and filter options.
 */

/**
 * All supported filter types
 */
export type ListFilterType =
  | 'text'           // Text search with debounce
  | 'select'         // Single select dropdown
  | 'multiSelect'    // Multiple select dropdown
  | 'dateRange'      // Date range picker (from-to)
  | 'date'           // Single date picker
  | 'boolean'        // Checkbox/Switch
  | 'number'         // Number input
  | 'numberRange'    // Number range slider (min-max)
  | 'chips'          // Visual chip selection (tags)
  | 'autocomplete';  // Search with autocomplete suggestions

/**
 * Option for select/multiSelect filters
 */
export interface ListFilterOption {
  value: any;
  label: string;
  icon?: string;
  color?: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Configuration for a single filter
 */
export interface ListFilterConfig<T = any> {
  /** Type of filter */
  type: ListFilterType;

  /** Unique key for this filter */
  key: string;

  /** Display label */
  label?: string;

  /** Icon name (DynamicIcons format) */
  icon?: string;

  /** Default value when component mounts */
  defaultValue?: any;

  // === Text Filter Options ===
  /** Fields to search in (supports nested paths like 'venues[].name') */
  searchFields?: string[];

  /** Placeholder text */
  placeholder?: string;

  /** Debounce delay in ms (default: 300) */
  debounceDelay?: number;

  // === Select/MultiSelect Options ===
  /** Options for select/multiSelect filters */
  options?: ListFilterOption[];

  /** Allow creating new options (for autocomplete) */
  allowCreate?: boolean;

  // === Date/DateRange Options ===
  /** Target field for date comparison */
  targetField?: string;

  /** Minimum selectable date */
  minDate?: Date;

  /** Maximum selectable date */
  maxDate?: Date;

  /** Date format for display */
  dateFormat?: string;

  // === NumberRange Options ===
  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Step increment */
  step?: number;

  /** Show input fields alongside slider */
  showInputs?: boolean;

  // === Custom Filter Function ===
  /**
   * Custom filter function
   * If provided, this takes precedence over default filtering logic
   *
   * @param item - The item being filtered
   * @param filterValue - Current value of the filter
   * @param currentUser - Current logged-in user (optional)
   * @returns true if item should be included, false otherwise
   */
  filterFunction?: (item: T, filterValue: any, currentUser?: any) => boolean;

  // === UI Options ===
  /** Show badge indicator when filter is active */
  showBadge?: boolean;

  /** Always show this filter (not collapsible) */
  alwaysVisible?: boolean;

  /** Filter is disabled */
  disabled?: boolean;

  /** Tooltip/help text */
  helpText?: string;

  /** Width of the filter component (CSS value) */
  width?: string | number;

  /** Custom class name */
  className?: string;
}

/**
 * Internal state of all active filters
 */
export interface ListFiltersState {
  [filterKey: string]: any;
}

/**
 * Filter metadata for tracking active filters
 */
export interface ListFilterMetadata {
  key: string;
  label?: string;
  value: any;
  isActive: boolean;
}

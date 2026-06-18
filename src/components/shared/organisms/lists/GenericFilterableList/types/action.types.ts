/**
 * Action Types for GenericFilterableList
 *
 * Defines all action-related types including individual actions,
 * bulk actions, and action configurations.
 */

/**
 * Type of action UI component
 */
export type ListActionType = 'button' | 'select' | 'custom';

/**
 * Option for select-type actions
 */
export interface ListActionOption {
  value: any;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

/**
 * Individual action configuration
 */
export interface ListActionConfig<T = any> {
  /** Unique action name */
  name: string;

  /** Display label */
  label: string;

  /** Icon name (DynamicIcons format) */
  icon?: string;

  /** Color/theme */
  color?: string;

  /** Type of action UI */
  type?: ListActionType;

  // === Conditional Display ===
  /**
   * Condition to show this action
   *
   * @param item - The item
   * @param currentUser - Current logged-in user
   * @returns true if action should be shown
   */
  showIf?: (item: T, currentUser?: any) => boolean;

  /**
   * Condition to disable this action
   *
   * @param item - The item
   * @returns true if action should be disabled
   */
  disabledIf?: (item: T) => boolean;

  // === Select Type Options ===
  /** Options for select-type actions */
  options?: ListActionOption[];

  // === Handler ===
  /**
   * Action handler function
   *
   * @param item - The item
   * @param payload - Additional payload (for select type: selected value)
   * @returns void or Promise
   */
  handler: (item: T, payload?: any) => void | Promise<void>;

  // === Loading ===
  /** Show loading indicator during action execution */
  showLoading?: boolean;

  /** Key to track loading state (defaults to action name) */
  loadingKey?: string;

  // === Confirmation ===
  /** Require confirmation before executing */
  requireConfirmation?: boolean;

  /** Confirmation dialog message */
  confirmationMessage?: string | ((item: T) => string);

  /** Confirmation dialog title */
  confirmationTitle?: string;

  // === UI Options ===
  /** Custom class name */
  className?: string;

  /** Tooltip */
  tooltip?: string;

  /** Action variant (primary, secondary, danger, etc.) */
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success';
}

/**
 * Bulk action configuration
 */
export interface ListBulkAction<T = any> {
  /** Unique action name */
  name: string;

  /** Display label */
  label: string;

  /** Icon name */
  icon?: string;

  /** Color/theme */
  color?: string;

  /**
   * Action handler for multiple items
   *
   * @param items - Selected items
   * @returns void or Promise
   */
  handler: (items: T[]) => void | Promise<void>;

  /**
   * Condition to show this bulk action
   *
   * @param items - Selected items
   * @returns true if action should be shown
   */
  showIf?: (items: T[]) => boolean;

  /**
   * Condition to disable this bulk action
   *
   * @param items - Selected items
   * @returns true if action should be disabled
   */
  disabledIf?: (items: T[]) => boolean;

  // === Confirmation ===
  /** Require confirmation before executing */
  requireConfirmation?: boolean;

  /** Confirmation message (can use {count} placeholder) */
  confirmationMessage?: string | ((items: T[]) => string);

  /** Confirmation dialog title */
  confirmationTitle?: string;

  // === UI Options ===
  /** Custom class name */
  className?: string;

  /** Action variant */
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success';
}

/**
 * Bulk actions configuration
 */
export interface ListBulkActionsConfig<T = any> {
  /** Enable bulk actions */
  enabled: boolean;

  /** Show "Select All" option */
  selectAll?: boolean;

  /** Select all only current page or all items */
  selectAllScope?: 'page' | 'all';

  /** Available bulk actions */
  actions: ListBulkAction<T>[];

  /** Position of bulk actions bar */
  position?: 'top' | 'bottom' | 'both';

  /** Sticky bulk actions bar */
  sticky?: boolean;
}

/**
 * View Types for GenericFilterableList
 *
 * Defines all view-related types including view modes,
 * card configurations, table configurations, etc.
 */

import React from 'react';

/**
 * Available view modes
 */
export type ListViewMode = 'cards' | 'table' | 'grid' | 'kanban';

/**
 * Renderer function for custom field rendering
 */
export type ListFieldRenderer<T> = (item: T) => React.ReactNode;

/**
 * Configuration for card section (header, body, footer)
 */
export interface ListCardSectionConfig<T> {
  /** Fields to display (can be property keys or custom renderers) */
  fields?: (keyof T | ListFieldRenderer<T>)[];

  /** Custom component for this section */
  component?: React.ComponentType<{ item: T }>;

  /** CSS class for this section */
  className?: string;
}

/**
 * Configuration for card view
 */
export interface ListCardViewConfig<T> {
  // === Option 1: Custom Component ===
  /** Completely custom card component */
  component?: React.ComponentType<{
    item: T;
    actions?: any;
    isSelected?: boolean;
    onSelect?: (item: T) => void;
  }>;

  // === Option 2: Standard Card with Sections ===
  /** Sections configuration (header, body, footer) */
  sections?: {
    header?: ListCardSectionConfig<T>;
    body?: ListCardSectionConfig<T>;
    footer?: ListCardSectionConfig<T>;
  };

  // === Layout Options ===
  /** Number of cards per row (or 'auto' for responsive) */
  cardsPerRow?: number | 'auto';

  /** Minimum card width (CSS value) */
  minCardWidth?: string;

  /** Maximum card width (CSS value) */
  maxCardWidth?: string;

  /** Gap between cards (CSS value) */
  gap?: string;

  // === UI Options ===
  /** Show elevation/shadow */
  elevation?: boolean;

  /** Show hover effect */
  hover?: boolean;

  /** Card border radius */
  borderRadius?: string;

  /** Custom class name */
  className?: string;
}

/**
 * Alignment for table columns
 */
export type ListTableColumnAlign = 'left' | 'center' | 'right';

/**
 * Table column configuration
 */
export interface ListTableColumn<T> {
  /** Unique key for this column */
  key: string;

  /** Column header label */
  label: string;

  /** Is this column sortable */
  sortable?: boolean;

  /** Column width (CSS value or number for pixels) */
  width?: string | number;

  /** Text alignment */
  align?: ListTableColumnAlign;

  /** Sticky column (left or right) */
  sticky?: 'left' | 'right';

  // === Rendering Options ===
  /**
   * Custom render function for cell content
   *
   * @param value - The value of the field
   * @param item - The full item object
   * @param index - Row index
   * @returns ReactNode to render
   */
  render?: (value: any, item: T, index: number) => React.ReactNode;

  /** Custom component for cell content */
  component?: React.ComponentType<{
    value: any;
    item: T;
    index: number;
  }>;

  /** Custom header component */
  headerComponent?: React.ComponentType<{ column: ListTableColumn<T> }>;

  // === UI Options ===
  /** Hide this column */
  hidden?: boolean;

  /** Custom class for cells in this column */
  className?: string;

  /** Custom class for header */
  headerClassName?: string;

  /** Tooltip for header */
  headerTooltip?: string;
}

/**
 * Row action for table view
 */
export interface ListRowActionConfig<T> {
  name: string;
  icon?: string;
  label?: string;
  showIf?: (item: T) => boolean;
  handler: (item: T) => void | Promise<void>;
}

/**
 * Configuration for table view
 */
export interface ListTableViewConfig<T> {
  /** Column definitions */
  columns: ListTableColumn<T>[];

  /** Row actions (edit, delete, etc.) */
  rowActions?: ListRowActionConfig<T>[];

  /** Sticky header */
  stickyHeader?: boolean;

  /** Striped rows */
  striped?: boolean;

  /** Hoverable rows */
  hoverable?: boolean;

  /** Compact mode (smaller padding) */
  compact?: boolean;

  /** Show borders */
  bordered?: boolean;

  /** Custom row class function */
  rowClassName?: (item: T, index: number) => string;

  /** Custom class name for table */
  className?: string;

  /** Callback when row is clicked */
  onRowClick?: (item: T) => void;
}

/**
 * Configuration for grid view (Pinterest-style)
 */
export interface ListGridViewConfig<T> {
  /** Custom component for grid item */
  component?: React.ComponentType<{ item: T }>;

  /** Number of columns */
  columns?: number | 'auto';

  /** Gap between items */
  gap?: string;

  /** Minimum item width */
  minItemWidth?: string;

  /** Enable masonry layout (items with variable heights) */
  masonry?: boolean;

  /** Custom class name */
  className?: string;
}

/**
 * Kanban column configuration
 */
export interface ListKanbanColumn<T> {
  /** Unique key */
  key: string;

  /** Column title */
  title: string;

  /** Filter function to include items in this column */
  filterFunction: (item: T) => boolean;

  /** Maximum items in this column (optional) */
  maxItems?: number;

  /** Color/theme for this column */
  color?: string;

  /** Icon for column header */
  icon?: string;
}

/**
 * Configuration for Kanban view
 */
export interface ListKanbanViewConfig<T> {
  /** Kanban columns */
  columns: ListKanbanColumn<T>[];

  /** Custom component for kanban card */
  cardComponent?: React.ComponentType<{ item: T }>;

  /** Enable drag and drop */
  enableDragDrop?: boolean;

  /** Callback when item is moved between columns */
  onItemMove?: (item: T, fromColumn: string, toColumn: string) => void | Promise<void>;

  /** Gap between columns */
  columnGap?: string;

  /** Gap between cards */
  cardGap?: string;

  /** Custom class name */
  className?: string;
}

/**
 * Overall view configuration
 */
export interface ListViewConfig<T> {
  /** Default view mode */
  default: ListViewMode;

  /** Available view modes */
  available: ListViewMode[];

  /** Card view configuration */
  cards?: ListCardViewConfig<T>;

  /** Table view configuration */
  table?: ListTableViewConfig<T>;

  /** Grid view configuration */
  grid?: ListGridViewConfig<T>;

  /** Kanban view configuration */
  kanban?: ListKanbanViewConfig<T>;
}

/**
 * UI Types for GenericFilterableList
 *
 * Defines UI-related types including tabs, empty states,
 * and general UI configuration.
 */

import React from 'react';

/**
 * Tab configuration
 */
export interface ListTabConfig<T = any> {
  /** Unique tab key */
  key: string;

  /** Display label */
  label: string;

  /** Icon name (DynamicIcons format) */
  icon?: string;

  /** Badge content (number or string) */
  badge?: number | string;

  /** Badge color */
  badgeColor?: string;

  /**
   * Filter function for this tab
   * Items will be filtered to show only those that pass this function
   *
   * @param item - The item to test
   * @returns true if item belongs to this tab
   */
  filterFunction?: (item: T) => boolean;

  /** Custom content component for this tab */
  component?: React.ComponentType<any>;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Empty state configuration
 */
export interface ListEmptyStateConfig {
  /** Icon name (DynamicIcons format) */
  icon?: string;

  /** Title text */
  title: string;

  /** Description text */
  description?: string;

  /** Action button configuration */
  action?: {
    label: string;
    handler: () => void;
    icon?: string;
    variant?: 'primary' | 'secondary';
  };

  /** Custom component for empty state */
  component?: React.ComponentType<any>;

  /** Image to display instead of icon */
  image?: string;

  /** Custom class name */
  className?: string;
}

/**
 * Loading state configuration
 */
export interface ListLoadingStateConfig {
  /** Loading message */
  message?: string;

  /** Use skeleton loaders instead of spinner */
  useSkeleton?: boolean;

  /** Number of skeleton items to show */
  skeletonCount?: number;

  /** Custom loading component */
  component?: React.ComponentType<any>;

  /** Show loading overlay */
  overlay?: boolean;

  /** Custom class name */
  className?: string;
}

/**
 * General UI configuration
 */
export interface ListUIConfig<T = any> {
  // === Header ===
  /** Page/list title */
  title?: string | React.ReactNode;

  /** Subtitle */
  subtitle?: string;

  /** Icon for header */
  icon?: string;

  /** Custom header component (replaces default) */
  headerComponent?: React.ComponentType<any>;

  /** Sticky header on scroll */
  stickyHeader?: boolean;

  /** Header height (for scroll calculations) */
  headerHeight?: number;

  // === Tabs ===
  /** Tab configurations */
  tabs?: ListTabConfig<T>[];

  /** Default active tab key */
  defaultTab?: string;

  // === Empty State ===
  /** Empty state when no items */
  emptyState?: ListEmptyStateConfig;

  /** Empty state when no search results */
  noResultsState?: ListEmptyStateConfig;

  // === Loading ===
  /** Loading state configuration */
  loadingState?: ListLoadingStateConfig;

  // === Layout ===
  /** Container max width */
  maxWidth?: string | number;

  /** Container padding */
  padding?: string;

  /** Custom container class */
  containerClassName?: string;

  // === Theme ===
  /** Color scheme */
  colorScheme?: 'light' | 'dark' | 'auto';

  /** Primary color */
  primaryColor?: string;

  // === Accessibility ===
  /** ARIA label for the list */
  ariaLabel?: string;

  /** Announce changes to screen readers */
  announceChanges?: boolean;
}

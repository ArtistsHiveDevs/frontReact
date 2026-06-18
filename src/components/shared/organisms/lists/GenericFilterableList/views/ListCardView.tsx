/**
 * ListCardView Component
 *
 * Grid-based card view with:
 * - Responsive grid layout
 * - Configurable cards per row
 * - Custom card components or standard card
 * - Click handlers
 * - Loading states
 */

import React from 'react';
import { ListCardViewConfig } from '../types/view.types';

export interface ListCardViewProps<T> {
  /** View configuration */
  config: ListCardViewConfig<T>;

  /** Data items to display */
  data: T[];

  /** Callback when item is clicked */
  onItemClick?: (item: T) => void;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Loading state */
  loading?: boolean;

  /** Items currently loading (for individual loading states) */
  loadingItems?: Set<string | number>;

  /** Get item ID for tracking */
  getItemId?: (item: T) => string | number;
}

/**
 * Card View Component
 */
export function ListCardView<T>({
  config,
  data,
  onItemClick,
  className = '',
  testId,
  loading = false,
  loadingItems,
  getItemId,
}: ListCardViewProps<T>) {
  // Determine cards per row
  const cardsPerRow = config.cardsPerRow || {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  // Grid class based on cards per row
  const gridClass = `list-card-view__grid
    list-card-view__grid--mobile-${cardsPerRow.mobile}
    list-card-view__grid--tablet-${cardsPerRow.tablet}
    list-card-view__grid--desktop-${cardsPerRow.desktop}`;

  // Check if item is loading
  const isItemLoading = (item: T): boolean => {
    if (!loadingItems || !getItemId) return false;
    return loadingItems.has(getItemId(item));
  };

  // Handle card click
  const handleCardClick = (item: T) => {
    if (config.onClick) {
      config.onClick(item);
    } else if (onItemClick) {
      onItemClick(item);
    }
  };

  // Render custom card component
  const renderCustomCard = (item: T, index: number) => {
    if (!config.cardComponent) return null;

    const CardComponent = config.cardComponent;
    const itemId = getItemId ? getItemId(item) : index;
    const itemLoading = isItemLoading(item);

    return (
      <div
        key={itemId}
        className={`list-card-view__card-wrapper ${
          itemLoading ? 'list-card-view__card-wrapper--loading' : ''
        }`}
        onClick={() => !itemLoading && handleCardClick(item)}
        role={config.onClick || onItemClick ? 'button' : undefined}
        tabIndex={config.onClick || onItemClick ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !itemLoading) {
            e.preventDefault();
            handleCardClick(item);
          }
        }}
      >
        <CardComponent item={item} loading={itemLoading} />
      </div>
    );
  };

  // If no data
  if (data.length === 0) {
    return (
      <div className={`list-card-view list-card-view--empty ${className}`}>
        <div className="list-card-view__empty">
          {config.emptyMessage || 'No items to display'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`list-card-view ${className} ${loading ? 'list-card-view--loading' : ''}`}
      data-testid={testId || 'list-card-view'}
    >
      <div className={gridClass}>
        {data.map((item, index) => renderCustomCard(item, index))}
      </div>

      {/* Loading overlay (if needed) */}
      {loading && config.showLoadingOverlay && (
        <div className="list-card-view__loading-overlay">
          <div className="list-card-view__loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default ListCardView;

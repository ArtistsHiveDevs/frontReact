/**
 * ListEmptyState Component
 *
 * Empty state display with:
 * - Icon or image
 * - Title and description
 * - Optional action button
 * - Custom component support
 * - Different variants (no data vs no results)
 */

import React from 'react';
import { ListEmptyStateConfig } from '../types/ui.types';

export interface ListEmptyStateProps {
  /** Empty state configuration */
  config?: ListEmptyStateConfig;

  /** Variant: no data or no search results */
  variant?: 'empty' | 'no-results';

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;
}

/**
 * Empty State Component
 */
export const ListEmptyState: React.FC<ListEmptyStateProps> = ({
  config,
  variant = 'empty',
  className = '',
  testId,
}) => {
  // Use custom component if provided
  if (config?.component) {
    const CustomComponent = config.component;
    return (
      <div
        className={`list-empty-state list-empty-state--custom ${className}`}
        data-testid={testId}
      >
        <CustomComponent />
      </div>
    );
  }

  // Default messages
  const defaultTitle = variant === 'no-results'
    ? 'No results found'
    : 'No items yet';

  const defaultDescription = variant === 'no-results'
    ? 'Try adjusting your filters or search query'
    : 'Get started by creating your first item';

  const title = config?.title || defaultTitle;
  const description = config?.description || defaultDescription;
  const icon = config?.icon || (variant === 'no-results' ? '🔍' : '📭');

  return (
    <div
      className={`list-empty-state list-empty-state--${variant} ${config?.className || ''} ${className}`}
      data-testid={testId || 'list-empty-state'}
      role="status"
      aria-live="polite"
    >
      <div className="list-empty-state__content">
        {/* Image or Icon */}
        {config?.image ? (
          <img
            src={config.image}
            alt=""
            className="list-empty-state__image"
            aria-hidden="true"
          />
        ) : (
          icon && (
            <div className="list-empty-state__icon" aria-hidden="true">
              {icon}
            </div>
          )
        )}

        {/* Title */}
        <h3 className="list-empty-state__title">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="list-empty-state__description">
            {description}
          </p>
        )}

        {/* Action button */}
        {config?.action && (
          <button
            type="button"
            className={`list-empty-state__action-btn list-empty-state__action-btn--${config.action.variant || 'primary'}`}
            onClick={config.action.handler}
          >
            {config.action.icon && (
              <span className="list-empty-state__action-icon" aria-hidden="true">
                {config.action.icon}
              </span>
            )}
            <span className="list-empty-state__action-label">
              {config.action.label}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ListEmptyState;

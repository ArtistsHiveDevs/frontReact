/**
 * ListLoadingState Component
 *
 * Loading state display with:
 * - Spinner or skeleton loaders
 * - Custom message
 * - Overlay mode
 * - Custom component support
 */

import React from 'react';
import { ListLoadingStateConfig } from '../types/ui.types';

export interface ListLoadingStateProps {
  /** Loading state configuration */
  config?: ListLoadingStateConfig;

  /** Use overlay mode (over existing content) */
  overlay?: boolean;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;
}

/**
 * Loading State Component
 */
export const ListLoadingState: React.FC<ListLoadingStateProps> = ({
  config,
  overlay = false,
  className = '',
  testId,
}) => {
  // Use custom component if provided
  if (config?.component) {
    const CustomComponent = config.component;
    return (
      <div
        className={`list-loading-state list-loading-state--custom ${
          overlay ? 'list-loading-state--overlay' : ''
        } ${className}`}
        data-testid={testId}
      >
        <CustomComponent />
      </div>
    );
  }

  const message = config?.message || 'Loading...';
  const useSkeleton = config?.useSkeleton || false;
  const skeletonCount = config?.skeletonCount || 3;
  const useOverlay = overlay || config?.overlay || false;

  // Skeleton loaders
  if (useSkeleton) {
    return (
      <div
        className={`list-loading-state list-loading-state--skeleton ${config?.className || ''} ${className}`}
        data-testid={testId || 'list-loading-state'}
        role="status"
        aria-label="Loading"
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="list-loading-state__skeleton-item">
            <div className="list-loading-state__skeleton-line list-loading-state__skeleton-line--title" />
            <div className="list-loading-state__skeleton-line list-loading-state__skeleton-line--text" />
            <div className="list-loading-state__skeleton-line list-loading-state__skeleton-line--text list-loading-state__skeleton-line--short" />
          </div>
        ))}
      </div>
    );
  }

  // Spinner with message
  return (
    <div
      className={`list-loading-state ${
        useOverlay ? 'list-loading-state--overlay' : ''
      } ${config?.className || ''} ${className}`}
      data-testid={testId || 'list-loading-state'}
      role="status"
      aria-label="Loading"
    >
      <div className="list-loading-state__content">
        {/* Spinner */}
        <div className="list-loading-state__spinner" aria-hidden="true">
          <svg
            className="list-loading-state__spinner-svg"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="list-loading-state__spinner-circle"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
          </svg>
        </div>

        {/* Message */}
        {message && (
          <div className="list-loading-state__message">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListLoadingState;

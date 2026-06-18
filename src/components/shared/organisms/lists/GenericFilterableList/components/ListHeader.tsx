/**
 * ListHeader Component
 *
 * Header for the list with:
 * - Title and subtitle
 * - Icon optional
 * - Custom component slot
 * - Actions slot (e.g., view mode toggle, sort selector)
 * - Filter bar slot
 */

import React from 'react';

export interface ListHeaderProps {
  /** Title text or component */
  title?: string | React.ReactNode;

  /** Subtitle text */
  subtitle?: string;

  /** Icon (emoji or text) */
  icon?: string;

  /** Custom header component (replaces default) */
  customComponent?: React.ComponentType<any>;

  /** Actions slot (right side) */
  actions?: React.ReactNode;

  /** Filter bar slot (below header) */
  filterBar?: React.ReactNode;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;
}

/**
 * Header Component
 */
export const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  subtitle,
  icon,
  customComponent: CustomComponent,
  actions,
  filterBar,
  className = '',
  testId,
}) => {
  // If custom component provided, use it
  if (CustomComponent) {
    return (
      <div className={`list-header list-header--custom ${className}`} data-testid={testId}>
        <CustomComponent />
        {filterBar && (
          <div className="list-header__filter-bar">
            {filterBar}
          </div>
        )}
      </div>
    );
  }

  // Don't render if no content
  if (!title && !subtitle && !icon && !actions && !filterBar) {
    return null;
  }

  return (
    <div className={`list-header ${className}`} data-testid={testId || 'list-header'}>
      <div className="list-header__main">
        <div className="list-header__title-section">
          {icon && (
            <span className="list-header__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <div className="list-header__text">
            {title && (
              <h2 className="list-header__title">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="list-header__subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="list-header__actions">
            {actions}
          </div>
        )}
      </div>

      {filterBar && (
        <div className="list-header__filter-bar">
          {filterBar}
        </div>
      )}
    </div>
  );
};

export default ListHeader;

/**
 * ListStandardCard Component
 *
 * Standard configurable card with sections:
 * - Header (title, subtitle, badges)
 * - Body (fields, custom content)
 * - Footer (actions, metadata)
 * - Avatar/image optional
 */

import React from 'react';
import { ListCardSectionConfig } from '../types/view.types';
import { getNestedValue } from '../utils/commonHelpers';

export interface ListStandardCardProps<T> {
  /** Item data */
  item: T;

  /** Sections configuration */
  sections: {
    header?: ListCardSectionConfig<T>;
    body?: ListCardSectionConfig<T>;
    footer?: ListCardSectionConfig<T>;
  };

  /** Loading state */
  loading?: boolean;

  /** Callback when card is clicked */
  onClick?: (item: T) => void;

  /** Additional CSS class */
  className?: string;

  /** Show avatar/image */
  avatar?: {
    /** Field path for avatar image URL */
    field?: string;
    /** Fallback icon or text */
    fallback?: string;
    /** Position: left or top */
    position?: 'left' | 'top';
  };

  /** Badges configuration */
  badges?: Array<{
    /** Field path or static value */
    field?: string;
    /** Static label */
    label?: string;
    /** Color (from field or static) */
    color?: string;
    /** Color field path */
    colorField?: string;
    /** Show condition */
    showIf?: (item: T) => boolean;
  }>;
}

/**
 * Standard Card Component
 */
export function ListStandardCard<T>({
  item,
  sections,
  loading = false,
  onClick,
  className = '',
  avatar,
  badges = [],
}: ListStandardCardProps<T>) {
  // Render a section
  const renderSection = (sectionConfig?: ListCardSectionConfig<T>) => {
    if (!sectionConfig) return null;

    // Custom component
    if (sectionConfig.component) {
      const SectionComponent = sectionConfig.component;
      return <SectionComponent item={item} />;
    }

    // Fields-based rendering
    if (sectionConfig.fields && sectionConfig.fields.length > 0) {
      return (
        <div className="list-standard-card__fields">
          {sectionConfig.fields.map((field, index) => {
            // Check if field should be shown
            if (field.showIf && !field.showIf(item)) {
              return null;
            }

            // Get value
            let value: any;
            if (field.render) {
              value = field.render(item);
            } else if (field.key) {
              value = getNestedValue(item, field.key);
              if (field.formatter) {
                value = field.formatter(value, item);
              }
            }

            // Empty check
            if ((value === null || value === undefined || value === '') && !field.showEmpty) {
              return null;
            }

            return (
              <div
                key={field.key || index}
                className={`list-standard-card__field ${
                  field.inline ? 'list-standard-card__field--inline' : ''
                }`}
              >
                {field.label && (
                  <span className="list-standard-card__field-label">
                    {field.icon && <span className="list-standard-card__field-icon">{field.icon}</span>}
                    {field.label}:
                  </span>
                )}
                <span className="list-standard-card__field-value">
                  {value || field.emptyValue || '-'}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  // Render avatar
  const renderAvatar = () => {
    if (!avatar) return null;

    const avatarUrl = avatar.field ? getNestedValue(item, avatar.field) : null;

    return (
      <div className={`list-standard-card__avatar list-standard-card__avatar--${avatar.position || 'left'}`}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="list-standard-card__avatar-image"
            loading="lazy"
          />
        ) : (
          <div className="list-standard-card__avatar-fallback">
            {avatar.fallback || '?'}
          </div>
        )}
      </div>
    );
  };

  // Render badges
  const renderBadges = () => {
    if (badges.length === 0) return null;

    return (
      <div className="list-standard-card__badges">
        {badges.map((badge, index) => {
          // Check if badge should be shown
          if (badge.showIf && !badge.showIf(item)) {
            return null;
          }

          // Get badge label
          const label = badge.field ? getNestedValue(item, badge.field) : badge.label;
          if (!label) return null;

          // Get badge color
          const color = badge.colorField
            ? getNestedValue(item, badge.colorField)
            : badge.color;

          return (
            <span
              key={index}
              className="list-standard-card__badge"
              style={{ backgroundColor: color }}
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  const isClickable = !!onClick;

  return (
    <div
      className={`list-standard-card ${className} ${
        isClickable ? 'list-standard-card--clickable' : ''
      } ${loading ? 'list-standard-card--loading' : ''}`}
      onClick={() => !loading && onClick && onClick(item)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ') && !loading) {
          e.preventDefault();
          onClick!(item);
        }
      }}
    >
      {/* Avatar (top position) */}
      {avatar?.position === 'top' && renderAvatar()}

      <div className="list-standard-card__content">
        {/* Avatar (left position) */}
        {avatar?.position === 'left' && renderAvatar()}

        <div className="list-standard-card__main">
          {/* Header Section */}
          {sections.header && (
            <div className="list-standard-card__header">
              {renderSection(sections.header)}
              {renderBadges()}
            </div>
          )}

          {/* Body Section */}
          {sections.body && (
            <div className="list-standard-card__body">
              {renderSection(sections.body)}
            </div>
          )}

          {/* Footer Section */}
          {sections.footer && (
            <div className="list-standard-card__footer">
              {renderSection(sections.footer)}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="list-standard-card__loading-overlay">
          <div className="list-standard-card__loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default ListStandardCard;

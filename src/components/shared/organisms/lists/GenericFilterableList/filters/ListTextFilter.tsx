/**
 * ListTextFilter Component
 *
 * Text input filter with search icon, debounce, and clear button.
 * Supports placeholder, custom styling, and keyboard shortcuts.
 */

import React, { useRef, useEffect } from 'react';
import { ListFilterConfig } from '../types/filter.types';

export interface ListTextFilterProps {
  /** Filter configuration */
  config: ListFilterConfig<any>;

  /** Current filter value */
  value: string;

  /** Callback when value changes */
  onChange: (value: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Auto-focus on mount */
  autoFocus?: boolean;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Show search icon */
  showSearchIcon?: boolean;

  /** Show clear button when has value */
  showClearButton?: boolean;
}

/**
 * Text Filter Component
 */
export const ListTextFilter: React.FC<ListTextFilterProps> = ({
  config,
  value,
  onChange,
  placeholder,
  autoFocus = false,
  className = '',
  testId,
  disabled = false,
  showSearchIcon = true,
  showClearButton = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle clear
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Escape to clear
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      handleClear();
    }
  };

  const hasValue = value && value.length > 0;
  const displayPlaceholder = placeholder || config.placeholder || `Search by ${config.label}...`;

  return (
    <div
      className={`list-text-filter ${className}`}
      data-testid={testId || `list-text-filter-${config.key}`}
    >
      {config.label && (
        <label
          htmlFor={`filter-${config.key}`}
          className="list-text-filter__label"
        >
          {config.label}
        </label>
      )}

      <div className="list-text-filter__input-wrapper">
        {showSearchIcon && (
          <span className="list-text-filter__search-icon" aria-hidden="true">
            🔍
          </span>
        )}

        <input
          ref={inputRef}
          id={`filter-${config.key}`}
          type="text"
          className="list-text-filter__input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={displayPlaceholder}
          disabled={disabled}
          aria-label={config.label || `Filter by ${config.key}`}
          aria-describedby={config.description ? `filter-${config.key}-desc` : undefined}
        />

        {showClearButton && hasValue && !disabled && (
          <button
            type="button"
            className="list-text-filter__clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </div>

      {config.description && (
        <div
          id={`filter-${config.key}-desc`}
          className="list-text-filter__description"
        >
          {config.description}
        </div>
      )}
    </div>
  );
};

export default ListTextFilter;

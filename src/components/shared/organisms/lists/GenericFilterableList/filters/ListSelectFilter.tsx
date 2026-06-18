/**
 * ListSelectFilter Component
 *
 * Dropdown select filter with support for:
 * - Icons in options
 * - Colors in options
 * - Badge when active
 * - Custom rendering of selected value
 */

import React from 'react';
import { ListFilterConfig, ListFilterOption } from '../types/filter.types';

export interface ListSelectFilterProps {
  /** Filter configuration */
  config: ListFilterConfig<any>;

  /** Current filter value */
  value: string | number | null;

  /** Callback when value changes */
  onChange: (value: string | number | null) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Show badge when has value */
  showBadge?: boolean;

  /** Allow clearing selection */
  allowClear?: boolean;
}

/**
 * Select Filter Component
 */
export const ListSelectFilter: React.FC<ListSelectFilterProps> = ({
  config,
  value,
  onChange,
  placeholder,
  className = '',
  testId,
  disabled = false,
  showBadge = true,
  allowClear = true,
}) => {
  const options = config.options || [];

  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    if (newValue === '') {
      onChange(null);
    } else {
      // Try to parse as number if original options have numbers
      const hasNumberValues = options.some(opt => typeof opt.value === 'number');
      onChange(hasNumberValues ? Number(newValue) : newValue);
    }
  };

  // Find selected option for badge/display
  const selectedOption = options.find(opt => opt.value === value);
  const hasValue = value !== null && value !== undefined && value !== '';
  const displayPlaceholder = placeholder || config.placeholder || `Select ${config.label || 'option'}...`;

  return (
    <div
      className={`list-select-filter ${className} ${hasValue ? 'list-select-filter--has-value' : ''}`}
      data-testid={testId || `list-select-filter-${config.key}`}
    >
      {config.label && (
        <label
          htmlFor={`filter-${config.key}`}
          className="list-select-filter__label"
        >
          {config.label}
          {showBadge && hasValue && (
            <span className="list-select-filter__badge" aria-label="Filter active">
              ●
            </span>
          )}
        </label>
      )}

      <div className="list-select-filter__select-wrapper">
        <select
          id={`filter-${config.key}`}
          className="list-select-filter__select"
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
          aria-label={config.label || `Filter by ${config.key}`}
          aria-describedby={config.description ? `filter-${config.key}-desc` : undefined}
        >
          {/* Placeholder option */}
          <option value="">{displayPlaceholder}</option>

          {/* Render options */}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.icon && `${option.icon} `}
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown icon */}
        <span className="list-select-filter__dropdown-icon" aria-hidden="true">
          ▼
        </span>
      </div>

      {/* Show selected value with custom rendering if available */}
      {hasValue && selectedOption && (
        <div className="list-select-filter__selected-value">
          {selectedOption.icon && (
            <span className="list-select-filter__option-icon">
              {selectedOption.icon}
            </span>
          )}
          {selectedOption.color && (
            <span
              className="list-select-filter__option-color"
              style={{ backgroundColor: selectedOption.color }}
              aria-hidden="true"
            />
          )}
          <span className="list-select-filter__option-label">
            {selectedOption.label}
          </span>

          {allowClear && !disabled && (
            <button
              type="button"
              className="list-select-filter__clear-btn"
              onClick={() => onChange(null)}
              aria-label="Clear selection"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {config.description && (
        <div
          id={`filter-${config.key}-desc`}
          className="list-select-filter__description"
        >
          {config.description}
        </div>
      )}
    </div>
  );
};

export default ListSelectFilter;

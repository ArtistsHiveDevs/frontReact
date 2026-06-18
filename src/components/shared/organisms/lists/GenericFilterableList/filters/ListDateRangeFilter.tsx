/**
 * ListDateRangeFilter Component
 *
 * Date range picker with:
 * - From/To date inputs
 * - Validation (to >= from)
 * - Clear button
 * - Optional presets (today, this week, this month)
 */

import React, { useMemo } from 'react';
import { ListFilterConfig } from '../types/filter.types';

export interface DateRange {
  from: string | null;
  to: string | null;
}

export interface ListDateRangeFilterProps {
  /** Filter configuration */
  config: ListFilterConfig<any>;

  /** Current filter value */
  value: DateRange;

  /** Callback when value changes */
  onChange: (value: DateRange) => void;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Show preset buttons */
  showPresets?: boolean;

  /** Custom presets */
  presets?: Array<{
    label: string;
    getValue: () => DateRange;
  }>;
}

/**
 * Date Range Filter Component
 */
export const ListDateRangeFilter: React.FC<ListDateRangeFilterProps> = ({
  config,
  value,
  onChange,
  className = '',
  testId,
  disabled = false,
  showPresets = true,
  presets,
}) => {
  // Default presets
  const defaultPresets = useMemo(() => [
    {
      label: 'Today',
      getValue: (): DateRange => {
        const today = new Date().toISOString().split('T')[0];
        return { from: today, to: today };
      },
    },
    {
      label: 'This Week',
      getValue: (): DateRange => {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return {
          from: firstDay.toISOString().split('T')[0],
          to: lastDay.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'This Month',
      getValue: (): DateRange => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          from: firstDay.toISOString().split('T')[0],
          to: lastDay.toISOString().split('T')[0],
        };
      },
    },
  ], []);

  const presetsToUse = presets || defaultPresets;

  // Handle from date change
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value || null;
    onChange({ ...value, from: newFrom });
  };

  // Handle to date change
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value || null;
    onChange({ ...value, to: newTo });
  };

  // Handle clear
  const handleClear = () => {
    onChange({ from: null, to: null });
  };

  // Handle preset click
  const handlePresetClick = (preset: { label: string; getValue: () => DateRange }) => {
    onChange(preset.getValue());
  };

  // Validation: check if to date is before from date
  const hasValidationError = useMemo(() => {
    if (!value.from || !value.to) return false;
    return new Date(value.to) < new Date(value.from);
  }, [value.from, value.to]);

  const hasValue = value.from || value.to;

  return (
    <div
      className={`list-date-range-filter ${className} ${hasValidationError ? 'list-date-range-filter--error' : ''}`}
      data-testid={testId || `list-date-range-filter-${config.key}`}
    >
      {config.label && (
        <label className="list-date-range-filter__label">
          {config.label}
          {hasValue && (
            <span className="list-date-range-filter__badge" aria-label="Filter active">
              ●
            </span>
          )}
        </label>
      )}

      <div className="list-date-range-filter__inputs">
        {/* From Date */}
        <div className="list-date-range-filter__input-group">
          <label
            htmlFor={`filter-${config.key}-from`}
            className="list-date-range-filter__sublabel"
          >
            From
          </label>
          <input
            id={`filter-${config.key}-from`}
            type="date"
            className="list-date-range-filter__input"
            value={value.from || ''}
            onChange={handleFromChange}
            disabled={disabled}
            max={value.to || undefined}
            aria-label={`${config.label || 'Date range'} from`}
          />
        </div>

        {/* Separator */}
        <span className="list-date-range-filter__separator" aria-hidden="true">
          →
        </span>

        {/* To Date */}
        <div className="list-date-range-filter__input-group">
          <label
            htmlFor={`filter-${config.key}-to`}
            className="list-date-range-filter__sublabel"
          >
            To
          </label>
          <input
            id={`filter-${config.key}-to`}
            type="date"
            className="list-date-range-filter__input"
            value={value.to || ''}
            onChange={handleToChange}
            disabled={disabled}
            min={value.from || undefined}
            aria-label={`${config.label || 'Date range'} to`}
          />
        </div>

        {/* Clear Button */}
        {hasValue && !disabled && (
          <button
            type="button"
            className="list-date-range-filter__clear-btn"
            onClick={handleClear}
            aria-label="Clear date range"
          >
            ✕
          </button>
        )}
      </div>

      {/* Validation Error */}
      {hasValidationError && (
        <div className="list-date-range-filter__error" role="alert">
          End date must be after start date
        </div>
      )}

      {/* Presets */}
      {showPresets && !disabled && (
        <div className="list-date-range-filter__presets">
          {presetsToUse.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="list-date-range-filter__preset-btn"
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {config.description && (
        <div className="list-date-range-filter__description">
          {config.description}
        </div>
      )}
    </div>
  );
};

export default ListDateRangeFilter;

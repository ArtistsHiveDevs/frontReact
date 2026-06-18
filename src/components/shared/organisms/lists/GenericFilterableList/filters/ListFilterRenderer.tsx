/**
 * ListFilterRenderer Component
 *
 * Dynamic filter renderer that switches between different filter types
 * based on the filter configuration.
 */

import React from 'react';
import { ListFilterConfig } from '../types/filter.types';
import ListTextFilter from './ListTextFilter';
import ListSelectFilter from './ListSelectFilter';
import ListDateRangeFilter, { DateRange } from './ListDateRangeFilter';

export interface ListFilterRendererProps<T> {
  /** Filter configuration */
  config: ListFilterConfig<T>;

  /** Current filter value */
  value: any;

  /** Callback when value changes */
  onChange: (value: any) => void;

  /** Additional CSS class */
  className?: string;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Filter Renderer Component
 *
 * Dynamically renders the appropriate filter component based on type
 */
export function ListFilterRenderer<T>({
  config,
  value,
  onChange,
  className = '',
  disabled = false,
}: ListFilterRendererProps<T>) {
  // Check if filter should be visible based on showIf condition
  if (config.showIf && !config.showIf(value)) {
    return null;
  }

  const commonProps = {
    config,
    className,
    disabled,
  };

  // Render appropriate filter based on type
  switch (config.type) {
    case 'text':
      return (
        <ListTextFilter
          {...commonProps}
          value={value || ''}
          onChange={onChange}
          placeholder={config.placeholder}
          autoFocus={false}
          showSearchIcon={true}
          showClearButton={true}
        />
      );

    case 'select':
      return (
        <ListSelectFilter
          {...commonProps}
          value={value ?? null}
          onChange={onChange}
          placeholder={config.placeholder}
          showBadge={true}
          allowClear={true}
        />
      );

    case 'dateRange':
      return (
        <ListDateRangeFilter
          {...commonProps}
          value={value || { from: null, to: null }}
          onChange={onChange}
          showPresets={true}
        />
      );

    case 'multiSelect':
      // TODO: Implement in Sprint 7
      return (
        <div className="list-filter-placeholder">
          <strong>{config.label}</strong>
          <p>MultiSelect filter - Coming in Sprint 7</p>
        </div>
      );

    case 'date':
      // TODO: Implement in Sprint 7
      return (
        <div className="list-filter-placeholder">
          <strong>{config.label}</strong>
          <p>Date filter - Coming in Sprint 7</p>
        </div>
      );

    case 'boolean':
      // TODO: Implement in Sprint 7
      return (
        <div className="list-filter-placeholder">
          <strong>{config.label}</strong>
          <p>Boolean filter - Coming in Sprint 7</p>
        </div>
      );

    case 'number':
      // Simple number input for now
      return (
        <div className={`list-number-filter ${className}`}>
          {config.label && (
            <label htmlFor={`filter-${config.key}`}>
              {config.label}
            </label>
          )}
          <input
            id={`filter-${config.key}`}
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            placeholder={config.placeholder}
            disabled={disabled}
            min={config.min}
            max={config.max}
            step={config.step}
          />
        </div>
      );

    case 'numberRange':
      // TODO: Implement in Sprint 7
      return (
        <div className="list-filter-placeholder">
          <strong>{config.label}</strong>
          <p>NumberRange filter - Coming in Sprint 7</p>
        </div>
      );

    case 'chips':
      // TODO: Implement in Sprint 7
      return (
        <div className="list-filter-placeholder">
          <strong>{config.label}</strong>
          <p>Chips filter - Coming in Sprint 7</p>
        </div>
      );

    case 'autocomplete':
      // TODO: Implement in Sprint 7
      return (
        <div className="list-filter-placeholder">
          <strong>{config.label}</strong>
          <p>Autocomplete filter - Coming in Sprint 7</p>
        </div>
      );

    default:
      console.warn(`Unknown filter type: ${config.type}`);
      return (
        <div className="list-filter-error">
          <strong>{config.label}</strong>
          <p>Unknown filter type: {config.type}</p>
        </div>
      );
  }
}

export default ListFilterRenderer;

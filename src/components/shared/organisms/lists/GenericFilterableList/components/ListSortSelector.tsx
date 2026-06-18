/**
 * ListSortSelector Component
 *
 * Dropdown selector for sorting with:
 * - Sort options from configuration
 * - Direction toggle (ascending/descending)
 * - Visual indicators
 * - Keyboard accessible
 */

import React from 'react';
import { ListSortOption } from '../types/sorting.types';

export interface ListSortSelectorProps<T = any> {
  /** Available sort options */
  options: ListSortOption<T>[];

  /** Current sort key */
  currentSortKey?: string;

  /** Current sort direction */
  currentDirection: 'asc' | 'desc';

  /** Callback when sort changes */
  onSortChange: (key: string) => void;

  /** Callback when direction toggles */
  onDirectionToggle: () => void;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Show direction toggle button */
  showDirectionToggle?: boolean;

  /** Compact mode */
  compact?: boolean;
}

/**
 * Sort Selector Component
 */
export function ListSortSelector<T = any>({
  options,
  currentSortKey,
  currentDirection,
  onSortChange,
  onDirectionToggle,
  className = '',
  testId,
  showDirectionToggle = true,
  compact = false,
}: ListSortSelectorProps<T>) {
  // Filter out disabled options
  const availableOptions = options.filter(opt => !opt.disabled);

  // If no options, don't render
  if (availableOptions.length === 0) {
    return null;
  }

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey = e.target.value;
    if (newKey && newKey !== currentSortKey) {
      onSortChange(newKey);
    }
  };

  // Get current option
  const currentOption = availableOptions.find(opt => opt.key === currentSortKey);

  return (
    <div
      className={`list-sort-selector ${compact ? 'list-sort-selector--compact' : ''} ${className}`}
      data-testid={testId || 'list-sort-selector'}
    >
      {!compact && (
        <label htmlFor="sort-select" className="list-sort-selector__label">
          Sort by:
        </label>
      )}

      <div className="list-sort-selector__controls">
        {/* Sort dropdown */}
        <select
          id="sort-select"
          className="list-sort-selector__select"
          value={currentSortKey || ''}
          onChange={handleSortChange}
          aria-label="Sort by"
        >
          {!currentSortKey && (
            <option value="">Select sort...</option>
          )}
          {availableOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Direction toggle button */}
        {showDirectionToggle && currentSortKey && (
          <button
            type="button"
            className={`list-sort-selector__direction-btn list-sort-selector__direction-btn--${currentDirection}`}
            onClick={onDirectionToggle}
            aria-label={`Sort direction: ${currentDirection === 'asc' ? 'ascending' : 'descending'}`}
            title={currentDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
          >
            {currentDirection === 'asc' ? '↑' : '↓'}
          </button>
        )}
      </div>

      {/* Current sort info (compact mode) */}
      {compact && currentOption && (
        <div className="list-sort-selector__info" aria-live="polite">
          Sorted by {currentOption.label} ({currentDirection === 'asc' ? 'A-Z' : 'Z-A'})
        </div>
      )}
    </div>
  );
}

export default ListSortSelector;

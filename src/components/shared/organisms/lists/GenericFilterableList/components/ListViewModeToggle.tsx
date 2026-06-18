/**
 * ListViewModeToggle Component
 *
 * Toggle buttons to switch between view modes:
 * - Cards view
 * - Table view
 * - Grid view
 * - Kanban view
 */

import React from 'react';
import { ListViewMode } from '../types/view.types';

export interface ListViewModeToggleProps {
  /** Current view mode */
  currentMode: ListViewMode;

  /** Available view modes */
  availableModes: ListViewMode[];

  /** Callback when mode changes */
  onModeChange: (mode: ListViewMode) => void;

  /** Additional CSS class */
  className?: string;

  /** Test ID for testing */
  testId?: string;

  /** Show labels on buttons */
  showLabels?: boolean;

  /** Button variant */
  variant?: 'default' | 'compact' | 'minimal';
}

// View mode metadata
const VIEW_MODE_META: Record<
  ListViewMode,
  {
    icon: string;
    label: string;
    tooltip: string;
  }
> = {
  cards: {
    icon: '▦',
    label: 'Cards',
    tooltip: 'Cards view',
  },
  table: {
    icon: '☰',
    label: 'Table',
    tooltip: 'Table view',
  },
  grid: {
    icon: '⊞',
    label: 'Grid',
    tooltip: 'Grid view',
  },
  kanban: {
    icon: '⋮',
    label: 'Kanban',
    tooltip: 'Kanban view',
  },
};

/**
 * View Mode Toggle Component
 */
export const ListViewModeToggle: React.FC<ListViewModeToggleProps> = ({
  currentMode,
  availableModes,
  onModeChange,
  className = '',
  testId,
  showLabels = false,
  variant = 'default',
}) => {
  // Filter to only available modes
  const modes = availableModes.filter((mode) => VIEW_MODE_META[mode]);

  // If only one mode available, don't show toggle
  if (modes.length <= 1) {
    return null;
  }

  // Handle mode button click
  const handleModeClick = (mode: ListViewMode) => {
    if (mode !== currentMode) {
      onModeChange(mode);
    }
  };

  return (
    <div
      className={`list-view-mode-toggle list-view-mode-toggle--${variant} ${className}`}
      data-testid={testId || 'list-view-mode-toggle'}
      role="group"
      aria-label="View mode selector"
    >
      {modes.map((mode) => {
        const meta = VIEW_MODE_META[mode];
        const isActive = mode === currentMode;

        return (
          <button
            key={mode}
            type="button"
            className={`list-view-mode-toggle__button ${
              isActive ? 'list-view-mode-toggle__button--active' : ''
            }`}
            onClick={() => handleModeClick(mode)}
            aria-label={meta.tooltip}
            aria-pressed={isActive}
            title={meta.tooltip}
          >
            <span className="list-view-mode-toggle__icon" aria-hidden="true">
              {meta.icon}
            </span>
            {showLabels && (
              <span className="list-view-mode-toggle__label">{meta.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ListViewModeToggle;

/**
 * PrebookingsListHeader
 *
 * Header personalizado con tabs, filtros y sticky header
 * Exactamente igual al diseño original
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { PrebookingParticipantStatus } from '~/models/domain/prebooking';
import { useI18n } from '~/common/utils';

export interface PrebookingsListHeaderProps {
  // Tabs
  activeTab: 'proposals' | 'dialogs';
  onTabChange: (tab: 'proposals' | 'dialogs') => void;

  // Filters
  myApprovalFilter: string;
  onMyApprovalFilterChange: (value: string) => void;

  // Sort
  sortBy: string;
  onSortByChange: (value: string) => void;

  // Search
  searchText: string;
  onSearchTextChange: (value: string) => void;

  // Date filter
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  onDateFromChange: (value: Dayjs | null) => void;
  onDateToChange: (value: Dayjs | null) => void;

  // View mode
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;

  // Sort options
  sortOptions: Array<{ value: string; label: string }>;
}

/**
 * Get approval icon helper
 */
const getApprovalIcon = (status: string) => {
  switch (status) {
    case PrebookingParticipantStatus.INTERESTED:
      return { icon: 'FaCheckCircle', color: 'green' };
    case PrebookingParticipantStatus.PENDING:
      return { icon: 'TbClockHour2Filled', color: 'orange' };
    case PrebookingParticipantStatus.NOT_INTERESTED:
      return { icon: 'FaTimesCircle', color: '#b70707' };
    default:
      return { icon: 'go GoTasklist', color: '#202020' };
  }
};

export const PrebookingsListHeader: React.FC<PrebookingsListHeaderProps> = ({
  activeTab,
  onTabChange,
  myApprovalFilter,
  onMyApprovalFilterChange,
  sortBy,
  onSortByChange,
  searchText,
  onSearchTextChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  viewMode,
  onViewModeChange,
  sortOptions,
}) => {
  const { translateGlobalDict } = useI18n();
  const headerRef = useRef<HTMLDivElement>(null);

  const [openStatusSearchInputText, setOpenStatusSearchInputText] =
    useState(false);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [showFixedHeader, setShowFixedHeader] = useState(false);

  // Check for active filters
  const hasActiveSearch = searchText.trim() !== '';
  const hasActiveDateFilter = dateFrom !== null || dateTo !== null;
  const hasActiveMyApprovalFilter = myApprovalFilter !== '';

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        setShowFixedHeader(headerRect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle search/date filter
  const showHideSearchField = () => {
    if (!openStatusSearchInputText) {
      setOpenDateFilter(false);
    }
    setOpenStatusSearchInputText(!openStatusSearchInputText);
  };

  const showHideDateFilter = () => {
    if (!openDateFilter) {
      setOpenStatusSearchInputText(false);
    }
    setOpenDateFilter(!openDateFilter);
  };

  const clearSearch = () => {
    onSearchTextChange('');
  };

  const clearDateFilter = () => {
    onDateFromChange(null);
    onDateToChange(null);
  };

  // My approval filters
  const createMyApprovalFilters = () => [
    {
      value: '',
      label: 'Todas',
      getIcon: () => ({ icon: 'go GoTasklist', color: '#202020' }),
    },
    {
      value: PrebookingParticipantStatus.INTERESTED,
      label: translateGlobalDict(
        `prebooking.participant_status.${PrebookingParticipantStatus.INTERESTED}`
      ),
      getIcon: () => getApprovalIcon(PrebookingParticipantStatus.INTERESTED),
    },
    {
      value: PrebookingParticipantStatus.PENDING,
      label: translateGlobalDict(
        `prebooking.participant_status.${PrebookingParticipantStatus.PENDING}`
      ),
      getIcon: () => getApprovalIcon(PrebookingParticipantStatus.PENDING),
    },
    {
      value: PrebookingParticipantStatus.NOT_INTERESTED,
      label: translateGlobalDict(
        `prebooking.participant_status.${PrebookingParticipantStatus.NOT_INTERESTED}`
      ),
      getIcon: () => getApprovalIcon(PrebookingParticipantStatus.NOT_INTERESTED),
    },
  ];

  const myApprovalFilters = createMyApprovalFilters();

  // Render header content
  const renderHeaderContent = () => (
    <>
      {/* Title and tabs */}
      <h3>Prebookings</h3>
      <div className="pb-step-title">
        <div
          className={`pb-step-tab${activeTab === 'proposals' ? ' pb-step-tab--active' : ''}`}
          onClick={() => onTabChange('proposals')}
        >
          <DynamicIcons iconName="fa FaCalendarPlus" size={18} />
          <span>Propuestas</span>
        </div>
        <div
          className={`pb-step-tab${activeTab === 'dialogs' ? ' pb-step-tab--active' : ''}`}
          onClick={() => onTabChange('dialogs')}
        >
          <DynamicIcons iconName="io5 IoChatbubbles" size={18} />
          <span>Diálogos</span>
        </div>
      </div>
    </>
  );

  const renderFiltersBar = () => (
    <>
      <div className="pb-header-filters">
        {/* My approval filter */}
        <FormControl size="small">
          <Select
            value={myApprovalFilter}
            onChange={(e) => onMyApprovalFilterChange(e.target.value)}
            displayEmpty
            renderValue={(value) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingRight: '1rem',
                  position: 'relative',
                }}
              >
                <DynamicIcons iconName="fa FaUserCheck" size={20} />
                {hasActiveMyApprovalFilter && <span className="pb-search-badge" />}
              </div>
            )}
            sx={{
              '& .MuiSelect-select': {
                padding: '6px 12px',
              },
              '& fieldset': {
                border: 'none',
              },
            }}
          >
            {myApprovalFilters.map((filter) => {
              const icon = filter.getIcon();
              return (
                <MenuItem key={filter.value} value={filter.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {icon && (
                      <DynamicIcons
                        iconName={icon.icon}
                        color={icon.color}
                        size={20}
                        background="white"
                      />
                    )}
                    <span>{filter.label}</span>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* Sort selector */}
        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            displayEmpty
            renderValue={(value) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingRight: '1rem',
                }}
              >
                <DynamicIcons iconName="tb TbArrowsSort" size={20} />
              </div>
            )}
            sx={{
              '& .MuiSelect-select': {
                padding: '6px 12px',
              },
              '& fieldset': {
                border: 'none',
              },
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date filter toggle */}
        <IconButton
          onClick={showHideDateFilter}
          size="small"
          aria-label={openDateFilter ? 'cerrar filtro de fecha' : 'abrir filtro de fecha'}
          className={hasActiveDateFilter ? 'active-filter' : ''}
          sx={{ position: 'relative' }}
        >
          {openDateFilter ? (
            <DynamicIcons iconName="FaRegCalendarTimes" size={20} />
          ) : (
            <DynamicIcons iconName="FaRegCalendarAlt" size={20} />
          )}
          {hasActiveDateFilter && <span className="pb-search-badge" />}
        </IconButton>

        {/* Search toggle */}
        <IconButton
          onClick={showHideSearchField}
          size="small"
          aria-label={openStatusSearchInputText ? 'cerrar búsqueda' : 'abrir búsqueda'}
          className={hasActiveSearch ? 'active-filter' : ''}
          sx={{ position: 'relative' }}
        >
          {openStatusSearchInputText ? (
            <DynamicIcons iconName="MdSearchOff" size={20} />
          ) : (
            <DynamicIcons iconName="AiOutlineSearch" size={20} />
          )}
          {hasActiveSearch && <span className="pb-search-badge" />}
        </IconButton>

        {/* View mode toggle */}
        <IconButton
          onClick={() => onViewModeChange(viewMode === 'cards' ? 'table' : 'cards')}
          size="small"
          aria-label={
            viewMode === 'cards' ? 'cambiar a vista de tabla' : 'cambiar a vista de tarjetas'
          }
        >
          {viewMode === 'cards' ? (
            <DynamicIcons iconName="FaList" size={20} />
          ) : (
            <DynamicIcons iconName="BsFillGrid3X3GapFill" size={20} />
          )}
        </IconButton>
      </div>

      {/* Filter params row */}
      <div className="pb-header-filter-params">
        {/* Search field */}
        {openStatusSearchInputText && (
          <TextField
            className="pb-search-field"
            placeholder="Buscar..."
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            size="small"
            autoFocus
            InputProps={{
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} edge="end" size="small">
                    <DynamicIcons iconName="MdClose" size={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Date range filter */}
        {openDateFilter && (
          <div className="pb-date-filter-container">
            <DatePicker
              className="pb-date-field"
              label="Desde"
              value={dateFrom}
              onChange={(date) => onDateFromChange(date)}
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
            />
            <DatePicker
              className="pb-date-field"
              label="Hasta"
              value={dateTo}
              onChange={(date) => onDateToChange(date)}
              minDate={dateFrom || undefined}
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
            />
            {hasActiveDateFilter && (
              <IconButton onClick={clearDateFilter} size="small">
                <DynamicIcons iconName="MdClose" size={20} />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Main header */}
      <div ref={headerRef} className="pb-list-top-header">
        {renderHeaderContent()}
        {renderFiltersBar()}
      </div>

      {/* Fixed header (sticky) */}
      <div className={['pb-lp-fixed-header', showFixedHeader ? 'visible' : ''].join(' ')}>
        <div className="pb-fixed-header-content">
          {renderHeaderContent()}
          {renderFiltersBar()}
        </div>
      </div>
    </>
  );
};

import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useRef, useState } from 'react';

import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { CalendarActivityModel, CalendarActivityType } from '~/models/domain/calendar/calendar-activity.model';
import { TRANSLATION_BASE_CALENDAR_PAGE } from '../calendar-page.constants';
import { AgendaList } from './AgendaList';
import { FiltersSheet } from './FiltersSheet';
import { MiniMonth } from './MiniMonth';
import { MonthStrip } from './MonthStrip';
import { buildAgendaWeeks, dayKeyOf, formatMonthLong, groupActivitiesByDay } from './mobile-calendar.utils';

import './MobileCalendar.scss';

interface MobileCalendarProps {
  activities: CalendarActivityModel[];
  visibleMonth: Dayjs;
  selectedTypes: CalendarActivityType[];
  showEmptyState: boolean;
  isMonthCollapsed: boolean;
  onMonthCollapsedToggle: () => void;
  onProgrammaticScrollStart: () => void;
  onMonthChange: (month: Dayjs) => void;
  onSelectedDayChange: (day: Dayjs) => void;
  onToggleType: (activityType: CalendarActivityType) => void;
  onActivityClick: (activity: CalendarActivityModel) => void;
}

export const MobileCalendar = ({
  activities,
  visibleMonth,
  selectedTypes,
  showEmptyState,
  isMonthCollapsed,
  onMonthCollapsedToggle,
  onProgrammaticScrollStart,
  onMonthChange,
  onSelectedDayChange,
  onToggleType,
  onActivityClick,
}: MobileCalendarProps) => {
  const { locale, translateText } = useI18n();

  const [selectedDayKey, setSelectedDayKey] = useState(() => dayKeyOf(dayjs()));
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);

  const pinnedHeaderRef = useRef<HTMLDivElement | null>(null);
  const dayElements = useRef<Record<string, HTMLDivElement | null>>({});

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_CALENDAR_PAGE}.${key}`);

  const todayKey = dayKeyOf(dayjs());
  const activitiesByDay = useMemo(() => groupActivitiesByDay(activities), [activities]);
  const agendaWeeks = useMemo(() => buildAgendaWeeks(activitiesByDay, visibleMonth), [activitiesByDay, visibleMonth]);

  const registerDayRef = (dayKey: string, element: HTMLDivElement | null) => {
    dayElements.current[dayKey] = element;
  };

  const handleSelectDay = (dayKey: string) => {
    const selectedDay = dayjs(dayKey);

    setSelectedDayKey(dayKey);
    onSelectedDayChange(selectedDay);

    if (!selectedDay.isSame(visibleMonth, 'month')) {
      onMonthChange(selectedDay.startOf('month'));
    }

    onProgrammaticScrollStart();

    if (!isMonthCollapsed) {
      onMonthCollapsedToggle();
    }

    window.setTimeout(() => {
      const dayElement = dayElements.current[dayKey];
      const pinnedHeader = pinnedHeaderRef.current;

      if (!dayElement || !pinnedHeader) {
        return;
      }

      const headerBottom = pinnedHeader.getBoundingClientRect().bottom;
      const dayTop = dayElement.getBoundingClientRect().top;

      window.scrollTo({
        top: window.scrollY + dayTop - headerBottom - 8,
        behavior: 'auto',
      });
    }, isMonthCollapsed ? 0 : 240);
  };

  return (
    <div className="mobile-calendar">
      <div ref={pinnedHeaderRef} className="mobile-calendar__pinned">
        <div className="mobile-calendar__header">
          <button
            type="button"
            aria-expanded={!isMonthCollapsed}
            className="mobile-calendar__month-toggle"
            onClick={onMonthCollapsedToggle}
          >
            <span className="mobile-calendar__month-name">{formatMonthLong(visibleMonth, locale)}</span>
            <span className="mobile-calendar__month-year">{visibleMonth.year()}</span>
            <DynamicIcons iconName={isMonthCollapsed ? 'MdExpandMore' : 'MdExpandLess'} size={22} />
          </button>

          <div className="mobile-calendar__header-actions">
            <button
              type="button"
              aria-label={translate('actions.filters')}
              className="mobile-calendar__icon-button"
              onClick={() => setAreFiltersOpen(true)}
            >
              <DynamicIcons iconName="MdTune" size={22} />
            </button>
          </div>
        </div>

        <div
          aria-hidden={isMonthCollapsed}
          className={`mobile-calendar__mini-month-wrapper${
            isMonthCollapsed ? ' mobile-calendar__mini-month-wrapper--collapsed' : ''
          }`}
        >
          <MiniMonth
            visibleMonth={visibleMonth}
            selectedDayKey={selectedDayKey}
            todayKey={todayKey}
            activitiesByDay={activitiesByDay}
            onSelectDay={handleSelectDay}
          />
        </div>

        <MonthStrip visibleMonth={visibleMonth} onSelectMonth={onMonthChange} />
      </div>

      {showEmptyState && <p className="mobile-calendar__empty">{translate('empty_state')}</p>}

      <AgendaList
        weeks={agendaWeeks}
        todayKey={todayKey}
        onActivityClick={onActivityClick}
        registerDayRef={registerDayRef}
      />

      <FiltersSheet
        open={areFiltersOpen}
        selectedTypes={selectedTypes}
        onToggleType={onToggleType}
        onClose={() => setAreFiltersOpen(false)}
      />
    </div>
  );
};

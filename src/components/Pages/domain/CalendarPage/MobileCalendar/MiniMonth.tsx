import { Dayjs } from 'dayjs';

import { useI18n } from '~/common/utils';
import { CalendarActivityModel } from '~/models/domain/calendar/calendar-activity.model';
import {
  buildMonthGridDays,
  buildWeekdayHeaders,
  dayKeyOf,
  MAX_DAY_MARKERS,
  MONTH_GRID_WEEKS,
  WEEK_LENGTH,
} from './mobile-calendar.utils';

interface MiniMonthProps {
  visibleMonth: Dayjs;
  selectedDayKey: string;
  todayKey: string;
  activitiesByDay: Map<string, CalendarActivityModel[]>;
  onSelectDay: (dayKey: string) => void;
}

export const MiniMonth = ({
  visibleMonth,
  selectedDayKey,
  todayKey,
  activitiesByDay,
  onSelectDay,
}: MiniMonthProps) => {
  const { locale } = useI18n();

  const weekdayHeaders = buildWeekdayHeaders(locale);
  const gridDays = buildMonthGridDays(visibleMonth);
  const weeks = Array.from({ length: MONTH_GRID_WEEKS }, (_, weekIndex) =>
    gridDays.slice(weekIndex * WEEK_LENGTH, (weekIndex + 1) * WEEK_LENGTH)
  );

  return (
    <div className="mobile-calendar__mini-month">
      <div className="mobile-calendar__weekdays">
        {weekdayHeaders.map((weekday) => (
          <span key={weekday.key} className="mobile-calendar__weekday">
            {weekday.label}
          </span>
        ))}
      </div>

      {weeks.map((week) => (
        <div key={dayKeyOf(week[0])} className="mobile-calendar__week">
          {week.map((day) => {
            const dayKey = dayKeyOf(day);
            const dayActivities = activitiesByDay.get(dayKey) || [];
            const hasHoliday = dayActivities.some((activity) => activity.type === 'holiday');
            const markerActivities = dayActivities.filter((activity) => activity.type !== 'holiday');
            const isOutsideMonth = day.month() !== visibleMonth.month();

            return (
              <button
                key={dayKey}
                type="button"
                aria-pressed={dayKey === selectedDayKey}
                className={[
                  'mobile-calendar__day',
                  isOutsideMonth ? 'mobile-calendar__day--outside' : '',
                  dayKey === todayKey ? 'mobile-calendar__day--today' : '',
                  dayKey === selectedDayKey ? 'mobile-calendar__day--selected' : '',
                  hasHoliday ? 'mobile-calendar__day--holiday' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelectDay(dayKey)}
              >
                <span className="mobile-calendar__day-number">{day.date()}</span>
                <span className="mobile-calendar__day-markers">
                  {markerActivities.slice(0, MAX_DAY_MARKERS).map((activity) => (
                    <span
                      key={activity.identifier}
                      className={`mobile-calendar__day-marker mobile-calendar__day-marker--${activity.type}`}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

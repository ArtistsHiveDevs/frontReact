import dayjs, { Dayjs } from 'dayjs';

import { CalendarActivityModel } from '~/models/domain/calendar/calendar-activity.model';

export const MAX_DAY_MARKERS = 3;
export const MONTH_STRIP_RADIUS = 12;
export const WEEK_LENGTH = 7;
export const MONTH_GRID_WEEKS = 6;

export interface AgendaDayGroup {
  dayKey: string;
  date: Dayjs;
  activities: CalendarActivityModel[];
}

export interface AgendaWeekGroup {
  weekKey: string;
  weekStart: Dayjs;
  weekEnd: Dayjs;
  days: AgendaDayGroup[];
}

export const dayKeyOf = (date: Dayjs): string => date.format('YYYY-MM-DD');

export const groupActivitiesByDay = (activities: CalendarActivityModel[]): Map<string, CalendarActivityModel[]> =>
  activities.reduce((groups, activity) => {
    const startDay = dayjs(activity.dayKey).startOf('day');

    if (!startDay.isValid()) {
      return groups;
    }

    const parsedEndDay = activity.end ? dayjs(activity.end).startOf('day') : startDay;
    const endDay = parsedEndDay.isValid() && parsedEndDay.isAfter(startDay) ? parsedEndDay : startDay;

    for (let day = startDay; !day.isAfter(endDay, 'day'); day = day.add(1, 'day')) {
      const dayKey = dayKeyOf(day);
      const existingGroup = groups.get(dayKey);

      if (existingGroup) {
        existingGroup.push(activity);
      } else {
        groups.set(dayKey, [activity]);
      }
    }

    return groups;
  }, new Map<string, CalendarActivityModel[]>());

export const buildMonthGridDays = (month: Dayjs): Dayjs[] => {
  const gridStart = month.startOf('month').startOf('week');

  return Array.from({ length: MONTH_GRID_WEEKS * WEEK_LENGTH }, (_, dayOffset) => gridStart.add(dayOffset, 'day'));
};

export const buildWeekdayHeaders = (locale: string): { key: string; label: string }[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  const weekStart = dayjs().startOf('week');

  return Array.from({ length: WEEK_LENGTH }, (_, dayOffset) => {
    const day = weekStart.add(dayOffset, 'day');

    return { key: dayKeyOf(day), label: formatter.format(day.toDate()) };
  });
};

export const buildMonthStrip = (visibleMonth: Dayjs): Dayjs[] => {
  const stripStart = visibleMonth.startOf('month').subtract(MONTH_STRIP_RADIUS, 'month');

  return Array.from({ length: MONTH_STRIP_RADIUS * 2 + 1 }, (_, monthOffset) => stripStart.add(monthOffset, 'month'));
};

export const buildAgendaWeeks = (
  activitiesByDay: Map<string, CalendarActivityModel[]>,
  visibleMonth: Dayjs
): AgendaWeekGroup[] => {
  const monthKey = visibleMonth.format('YYYY-MM');
  const dayGroups: AgendaDayGroup[] = Array.from(activitiesByDay.entries())
    .filter(([dayKey, activities]) => dayKey.startsWith(monthKey) && activities.length > 0)
    .map(([dayKey, activities]) => ({ dayKey, date: dayjs(dayKey), activities }))
    .sort((first, second) => (first.dayKey < second.dayKey ? -1 : 1));

  return dayGroups.reduce((weeks, dayGroup) => {
    const weekStart = dayGroup.date.startOf('week');
    const weekKey = dayKeyOf(weekStart);
    const currentWeek = weeks[weeks.length - 1];

    if (currentWeek?.weekKey === weekKey) {
      currentWeek.days.push(dayGroup);
    } else {
      weeks.push({ weekKey, weekStart, weekEnd: weekStart.endOf('week'), days: [dayGroup] });
    }

    return weeks;
  }, [] as AgendaWeekGroup[]);
};

export const formatMonthLong = (date: Dayjs, locale: string): string =>
  new Intl.DateTimeFormat(locale, { month: 'long' }).format(date.toDate());

export const formatMonthShort = (date: Dayjs, locale: string): string =>
  new Intl.DateTimeFormat(locale, { month: 'short' }).format(date.toDate());

export const formatWeekdayShort = (date: Dayjs, locale: string): string =>
  new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date.toDate());

export const formatTime = (value: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(value));

export const formatWeekRange = (weekStart: Dayjs, weekEnd: Dayjs, locale: string): string => {
  const start = `${formatMonthShort(weekStart, locale)} ${weekStart.date()}`;
  const end =
    weekStart.month() === weekEnd.month()
      ? `${weekEnd.date()}`
      : `${formatMonthShort(weekEnd, locale)} ${weekEnd.date()}`;

  return `${start} – ${end}`;
};

export const formatActivityTimeRange = (activity: CalendarActivityModel, locale: string): string => {
  if (activity.isAllDayBlock) {
    return '';
  }

  const start = formatTime(activity.start, locale);

  return activity.end ? `${start} – ${formatTime(activity.end, locale)}` : start;
};

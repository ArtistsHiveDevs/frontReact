import { useI18n } from '~/common/utils';
import { CalendarActivityModel } from '~/models/domain/calendar/calendar-activity.model';
import { TRANSLATION_BASE_CALENDAR_PAGE } from '../calendar-page.constants';
import { CalendarEventImage } from '../CalendarEventImage';
import {
  AgendaWeekGroup,
  formatActivityTimeRange,
  formatWeekdayShort,
  formatWeekRange,
} from './mobile-calendar.utils';

interface AgendaListProps {
  weeks: AgendaWeekGroup[];
  todayKey: string;
  onActivityClick: (activity: CalendarActivityModel) => void;
  registerDayRef: (dayKey: string, element: HTMLDivElement | null) => void;
}

export const AgendaList = ({ weeks, todayKey, onActivityClick, registerDayRef }: AgendaListProps) => {
  const { locale, translateText } = useI18n();

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_CALENDAR_PAGE}.${key}`);

  return (
    <div className="mobile-calendar__agenda">
      {weeks.map((week) => (
        <section key={week.weekKey} className="mobile-calendar__agenda-week">
          <h2 className="mobile-calendar__week-label">{formatWeekRange(week.weekStart, week.weekEnd, locale)}</h2>

          {week.days.map((day) => (
            <div
              key={day.dayKey}
              ref={(element) => registerDayRef(day.dayKey, element)}
              className={`mobile-calendar__agenda-day${
                day.dayKey === todayKey ? ' mobile-calendar__agenda-day--today' : ''
              }`}
            >
              <div className="mobile-calendar__agenda-date">
                <span className="mobile-calendar__agenda-weekday">{formatWeekdayShort(day.date, locale)}</span>
                <span className="mobile-calendar__agenda-day-number">{day.date.date()}</span>
              </div>

              <ul className="mobile-calendar__agenda-events">
                {day.activities.map((activity) => {
                  const timeRange = formatActivityTimeRange(activity, locale);
                  const title = activity.isDeadline
                    ? `${translate('deadline_label')}: ${activity.title}`
                    : activity.title;

                  return (
                    <li key={activity.identifier}>
                      <button
                        type="button"
                        disabled={!activity.isInteractive}
                        className={[
                          'mobile-calendar__event',
                          `mobile-calendar__event--${activity.type}`,
                          activity.isAllDayBlock ? 'mobile-calendar__event--all-day' : '',
                          activity.isExpired ? 'mobile-calendar__event--expired' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => onActivityClick(activity)}
                      >
                        <CalendarEventImage
                          alt=""
                          className="mobile-calendar__event-image"
                          source={activity.meta?.image}
                        />
                        <span className="mobile-calendar__event-copy">
                          <span className="mobile-calendar__event-title">{title}</span>
                          <span className="mobile-calendar__event-time">
                            {timeRange || translate('all_day')}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};

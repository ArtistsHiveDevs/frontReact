import { Dayjs } from 'dayjs';
import { Fragment, useEffect, useRef } from 'react';

import { useI18n } from '~/common/utils';
import { buildMonthStrip, formatMonthShort } from './mobile-calendar.utils';

interface MonthStripProps {
  visibleMonth: Dayjs;
  onSelectMonth: (month: Dayjs) => void;
}

export const MonthStrip = ({ visibleMonth, onSelectMonth }: MonthStripProps) => {
  const { locale } = useI18n();
  const activeMonthRef = useRef<HTMLButtonElement>(null);

  const visibleMonthKey = visibleMonth.format('YYYY-MM');
  const months = buildMonthStrip(visibleMonth);

  useEffect(() => {
    activeMonthRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [visibleMonthKey]);

  return (
    <div className="mobile-calendar__month-strip">
      {months.map((month) => {
        const monthKey = month.format('YYYY-MM');
        const isActive = monthKey === visibleMonthKey;

        return (
          <Fragment key={monthKey}>
            {month.month() === 0 && <span className="mobile-calendar__month-strip-year">{month.year()}</span>}
            <button
              ref={isActive ? activeMonthRef : undefined}
              type="button"
              aria-pressed={isActive}
              className={`mobile-calendar__month-strip-item${
                isActive ? ' mobile-calendar__month-strip-item--active' : ''
              }`}
              onClick={() => onSelectMonth(month)}
            >
              {formatMonthShort(month, locale)}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
};

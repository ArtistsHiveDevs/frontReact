import { Drawer, Switch } from '@mui/material';

import { useI18n } from '~/common/utils';
import {
  ALL_CALENDAR_ACTIVITY_TYPES,
  CalendarActivityType,
} from '~/models/domain/calendar/calendar-activity.model';
import { TRANSLATION_BASE_CALENDAR_PAGE } from '../calendar-page.constants';

interface FiltersSheetProps {
  open: boolean;
  selectedTypes: CalendarActivityType[];
  onToggleType: (activityType: CalendarActivityType) => void;
  onClose: () => void;
}

export const FiltersSheet = ({ open, selectedTypes, onToggleType, onClose }: FiltersSheetProps) => {
  const { translateText } = useI18n();

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_CALENDAR_PAGE}.${key}`);

  return (
    <Drawer anchor="bottom" open={open} className="mobile-calendar-filters" onClose={onClose}>
      <div className="mobile-calendar-filters__sheet">
        <span className="mobile-calendar-filters__handle" />
        <h2 className="mobile-calendar-filters__title">{translate('filters.title')}</h2>

        <ul className="mobile-calendar-filters__list">
          {ALL_CALENDAR_ACTIVITY_TYPES.map((activityType) => (
            <li key={activityType}>
              <label className="mobile-calendar-filters__option">
                <span className={`mobile-calendar-filters__dot mobile-calendar-filters__dot--${activityType}`} />
                <span className="mobile-calendar-filters__label">{translate(`types.${activityType}`)}</span>
                <Switch
                  checked={selectedTypes.includes(activityType)}
                  onChange={() => onToggleType(activityType)}
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  );
};

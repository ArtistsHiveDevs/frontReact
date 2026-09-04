import { DateSelectArg, DatesSetArg, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Alert } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectApiKey } from '~/common/slices/app-base/APIKey/selectors';
import {
  buildCalendarEventsQueryParams,
  selectorCalendarActivities,
  selectorCalendarEvents,
  useCalendarActivitiesSlice,
  useCalendarEventsSlice,
} from '~/common/slices/domain/calendar/calendar-activities.redux';
import { useI18n } from '~/common/utils';
import useWindowDimensions from '~/common/utils/hooks/screen/WindowDimensions.hook';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import {
  ALL_CALENDAR_ACTIVITY_TYPES,
  CalendarActivityModel,
  CalendarActivityTemplate,
  CalendarActivityType,
  sortCalendarActivities,
} from '~/models/domain/calendar/calendar-activity.model';
import { ActivityFormDialog, CalendarActivityDraft } from './ActivityFormDialog';
import { CalendarEventImage } from './CalendarEventImage';
import {
  ALL_DAY_DATE_FORMAT,
  CALENDAR_MOBILE_MAX_WIDTH,
  CalendarViewName,
  TRANSLATION_BASE_CALENDAR_PAGE,
} from './calendar-page.constants';
import { MobileCalendar } from './MobileCalendar';
import { useCollapsibleMonth } from './MobileCalendar/use-collapsible-month.hook';

import './CalendarPage.scss';

interface VisibleRange {
  from: string;
  to: string;
}

const isAgendaViewName = (viewName: string) => viewName.startsWith('list');

const monthVisibleRange = (month: Dayjs): VisibleRange => ({
  from: month.startOf('month').subtract(month.startOf('month').day(), 'day').toDate().toISOString(),
  to: month
    .endOf('month')
    .add(6 - month.endOf('month').day(), 'day')
    .toDate()
    .toISOString(),
});

const CalendarPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translateText } = useI18n();
  const { actions } = useCalendarEventsSlice();
  const { actions: activityActions } = useCalendarActivitiesSlice();

  const { width } = useWindowDimensions();
  const isMobileLayout = width < CALENDAR_MOBILE_MAX_WIDTH;

  const { isMonthCollapsed, toggleMonthCollapsed, beginProgrammaticScroll } = useCollapsibleMonth(isMobileLayout);

  const calendarRef = useRef<FullCalendar>(null);
  const desktopCalendarContainerRef = useRef<HTMLDivElement>(null);

  const { apiKey } = useSelector(selectApiKey);
  const calendarActivities: CalendarActivityModel[] = useSelector(selectorCalendarEvents.selectItems);
  const loading = useSelector(selectorCalendarEvents.selectLoading);
  const error = useSelector(selectorCalendarEvents.selectError);
  const activitySaving = useSelector(selectorCalendarActivities.selectLoading);
  const activityError = useSelector(selectorCalendarActivities.selectError);

  const [visibleRange, setVisibleRange] = useState<VisibleRange>();
  const [visibleMonth, setVisibleMonth] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [mobileSelectedDay, setMobileSelectedDay] = useState<Dayjs>(() => dayjs().startOf('day'));
  const [eventsRequested, setEventsRequested] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<CalendarActivityType[]>(ALL_CALENDAR_ACTIVITY_TYPES);
  const [currentViewName, setCurrentViewName] = useState<string>(CalendarViewName.MONTH);
  const [activityDraft, setActivityDraft] = useState<CalendarActivityDraft>();
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);
  const [showActivityError, setShowActivityError] = useState(false);

  const errorBeforeSaving = useRef(activityError);
  const wasSavingActivity = useRef(false);
  const wasLoadingCalendar = useRef(loading);
  const pendingCurrentTimeFocus = useRef(false);

  const isAgendaView = isAgendaViewName(currentViewName);

  const focusCurrentTime = () => {
    const indicator = desktopCalendarContainerRef.current?.querySelector<HTMLElement>(
      '.fc-timegrid-now-indicator-line'
    );

    if (!indicator) {
      return;
    }

    indicator.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });

    const fixedHeaderBottom =
      document.querySelector<HTMLElement>('.toolbar-header')?.getBoundingClientRect().bottom || 0;
    const visibleAreaCenter = fixedHeaderBottom + (window.innerHeight - fixedHeaderBottom) / 2;
    const correctedIndicatorTop = indicator.getBoundingClientRect().top;

    if (Math.abs(correctedIndicatorTop - visibleAreaCenter) > 1) {
      window.scrollBy({ top: correctedIndicatorTop - visibleAreaCenter, behavior: 'auto' });
    }
  };

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_CALENDAR_PAGE}.${key}`);

  const loadCalendarEvents = useCallback(() => {
    if (!apiKey || !visibleRange) {
      return;
    }

    const queryParams = buildCalendarEventsQueryParams({ ...visibleRange, types: ALL_CALENDAR_ACTIVITY_TYPES });

    dispatch(actions.loadItems({ queryParams }));
    setEventsRequested(true);
  }, [apiKey, visibleRange]);

  useEffect(() => {
    loadCalendarEvents();
  }, [loadCalendarEvents]);

  useLayoutEffect(() => {
    const finishedLoading = wasLoadingCalendar.current && !loading;

    if (finishedLoading && pendingCurrentTimeFocus.current) {
      pendingCurrentTimeFocus.current = false;
      focusCurrentTime();
    }

    wasLoadingCalendar.current = loading;
  }, [loading]);

  useEffect(() => {
    if (!isMobileLayout) {
      return;
    }

    setVisibleRange((previousRange) => {
      const nextRange = monthVisibleRange(visibleMonth);

      return previousRange?.from === nextRange.from && previousRange?.to === nextRange.to ? previousRange : nextRange;
    });
  }, [isMobileLayout, visibleMonth]);

  useEffect(() => {
    if (savingActivity && wasSavingActivity.current && !activitySaving) {
      const savingFailed = !!activityError && activityError !== errorBeforeSaving.current;

      setSavingActivity(false);
      setShowActivityError(savingFailed);

      if (!savingFailed) {
        setActivityDialogOpen(false);
        loadCalendarEvents();
      }
    }

    wasSavingActivity.current = activitySaving;
  }, [activitySaving]);

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const from = dateInfo.start.toISOString();
    const to = dateInfo.end.toISOString();

    setCurrentViewName(dateInfo.view.type);
    pendingCurrentTimeFocus.current = dateInfo.view.type.startsWith('timeGrid');
    setVisibleRange((previousRange) =>
      previousRange?.from === from && previousRange?.to === to ? previousRange : { from, to }
    );
  };

  const buildSecondaryText = (activity: CalendarActivityModel): string =>
    [activity.meta?.city, activity.meta?.notes].filter(Boolean).join(' · ');

  const buildTooltip = (activity: CalendarActivityModel, title: string): string => {
    const { meta } = activity;
    const tooltipLines = [`${translate(`types.${activity.type}`)} · ${title}`];

    if (activity.isExpired) {
      tooltipLines.push(translate('meta.expired'));
    }
    if (meta?.city) {
      tooltipLines.push(`${translate('meta.city')}: ${meta.city}`);
    }
    if (meta?.event_date) {
      tooltipLines.push(`${translate('meta.event_date')}: ${meta.event_date}`);
    }
    if (typeof meta?.applications_count === 'number') {
      tooltipLines.push(`${translate('meta.applications_count')}: ${meta.applications_count}`);
    }
    if (meta?.notes) {
      tooltipLines.push(`${translate('meta.notes')}: ${meta.notes}`);
    }

    return tooltipLines.join('\n');
  };

  const visibleActivities: CalendarActivityModel[] = useMemo(
    () =>
      sortCalendarActivities(
        calendarActivities.filter((activity) => !!activity && selectedTypes.includes(activity.type))
      ),
    [calendarActivities, selectedTypes]
  );

  const calendarEvents: EventInput[] = useMemo(() => {
    const buildCalendarEvent = (activity: CalendarActivityModel, sortIndex: number): EventInput => {
      const title = activity.isDeadline ? `${translate('deadline_label')}: ${activity.title}` : activity.title;
      const displayMode = activity.displayModeFor(isAgendaView);
      const startDay = dayjs(activity.start).format(ALL_DAY_DATE_FORMAT);
      const endDay = activity.end ? dayjs(activity.end).format(ALL_DAY_DATE_FORMAT) : startDay;
      const displaysInAllDayRow = activity.isAllDayBlock || startDay !== endDay;
      const displayEnd =
        displaysInAllDayRow && activity.end ? dayjs(endDay).add(1, 'day').format(ALL_DAY_DATE_FORMAT) : activity.end;

      return {
        id: activity.identifier,
        title,
        start: displaysInAllDayRow ? startDay : activity.start,
        end: activity.isDeadline ? undefined : displayEnd || undefined,
        allDay: displaysInAllDayRow,
        display: displayMode,
        classNames: [
          'calendar-event',
          `calendar-event--${activity.type}`,
          ...(displayMode === 'background' ? ['calendar-event--background'] : []),
          ...(activity.isInteractive ? [] : ['calendar-event--static']),
          ...(activity.isExpired ? ['calendar-event--expired'] : []),
        ],
        extendedProps: {
          sortIndex,
          tooltip: buildTooltip(activity, title),
          secondaryText: buildSecondaryText(activity),
          image: activity.meta?.image || null,
        },
      };
    };

    return visibleActivities.map(buildCalendarEvent);
  }, [visibleActivities, isAgendaView]);

  const buildDefaultActivityStart = (selectedDay?: Dayjs): string => {
    const now = new Date();
    const nextHalfHour = selectedDay ? selectedDay.toDate() : new Date(now);

    nextHalfHour.setSeconds(0, 0);
    nextHalfHour.setMinutes(now.getMinutes() < 30 ? 30 : 60);

    if (selectedDay) {
      return nextHalfHour.toISOString();
    }

    if (!visibleRange) {
      return nextHalfHour.toISOString();
    }

    const rangeStart = new Date(visibleRange.from);
    const rangeEnd = new Date(visibleRange.to);
    const todayIsVisible = now >= rangeStart && now < rangeEnd;

    if (todayIsVisible) {
      return nextHalfHour.toISOString();
    }

    const firstVisibleDay = new Date(rangeStart);

    firstVisibleDay.setHours(nextHalfHour.getHours(), nextHalfHour.getMinutes(), 0, 0);

    return firstVisibleDay.toISOString();
  };

  const openActivityForm = (draft: CalendarActivityDraft) => {
    setActivityDraft(draft);
    setShowActivityError(false);
    setActivityDialogOpen(true);
  };

  const handleDateSelect = (selectionInfo: DateSelectArg) => {
    openActivityForm({
      start: selectionInfo.startStr,
      end: selectionInfo.allDay ? null : selectionInfo.endStr,
      allDay: selectionInfo.allDay,
    });
  };

  const handleCreateActivity = () => {
    const start = buildDefaultActivityStart(isMobileLayout ? mobileSelectedDay : undefined);

    openActivityForm({ start, end: start, allDay: false });
  };

  const handleActivityClick = (activity: CalendarActivityModel) => {
    if (!activity.isInteractive) {
      return;
    }

    if (activity.isEditable) {
      openActivityForm({
        id: activity.id,
        title: activity.title,
        subtype: activity.subtype,
        start: activity.start,
        end: activity.end,
        allDay: activity.allDay,
        notes: activity.meta?.notes,
        image: activity.meta?.image,
      });

      return;
    }

    if (activity.detailRoute) {
      navigate(`${activity.detailRoute}/${activity.entityId || activity.id}`);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const activity = calendarActivities.find((item) => item?.identifier === clickInfo.event.id);

    if (activity) {
      handleActivityClick(activity);
    }
  };

  const startActivityMutation = () => {
    errorBeforeSaving.current = activityError;
    setShowActivityError(false);
    setSavingActivity(true);
  };

  const handleSaveActivity = (activity: CalendarActivityTemplate) => {
    startActivityMutation();

    if (activityDraft?.id) {
      dispatch(activityActions.updateItem({ id: activityDraft.id, newItem: activity }));
    } else {
      dispatch(activityActions.createItem({ data: activity }));
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    startActivityMutation();
    dispatch(activityActions.deleteItem({ id: activityId }));
  };

  const toggleTypeFilter = (activityType: CalendarActivityType) => {
    setSelectedTypes((previousTypes) =>
      previousTypes.includes(activityType)
        ? previousTypes.filter((selectedType) => selectedType !== activityType)
        : [...previousTypes, activityType]
    );
  };

  const showEmptyState = eventsRequested && !loading && !error && !calendarEvents.length;

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { image, tooltip, secondaryText } = eventInfo.event.extendedProps;
    const stacked = isAgendaViewName(eventInfo.view.type);

    return (
      <div className={`calendar-event__content${stacked ? ' calendar-event__content--stacked' : ''}`} title={tooltip}>
        <CalendarEventImage alt="" className="calendar-event__image" source={image} />
        <span className="calendar-event__main">
          {!stacked && !!eventInfo.timeText && <span className="calendar-event__time">{eventInfo.timeText}</span>}
          <span className="calendar-event__title">{eventInfo.event.title}</span>
        </span>
        {stacked && !!secondaryText && <span className="calendar-event__secondary">{secondaryText}</span>}
      </div>
    );
  };

  return (
    <div className="calendar-page">
      {!isMobileLayout && <h1 className="calendar-page__title">{translate('title')}</h1>}

      {!isMobileLayout && (
        <ul className="calendar-page__legend">
          {ALL_CALENDAR_ACTIVITY_TYPES.map((activityType) => (
            <li key={activityType}>
              <button
                type="button"
                aria-pressed={selectedTypes.includes(activityType)}
                className={`calendar-page__legend-item calendar-page__legend-item--${activityType} ${
                  selectedTypes.includes(activityType) ? '' : 'calendar-page__legend-item--off'
                }`.trim()}
                onClick={() => toggleTypeFilter(activityType)}
              >
                {translate(`types.${activityType}`)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!!error && <Alert severity="error">{translate('error')}</Alert>}

      {loading && <AppLoader />}

      {!isMobileLayout && showEmptyState && <p className="calendar-page__empty">{translate('empty_state')}</p>}

      {isMobileLayout ? (
        <MobileCalendar
          activities={visibleActivities}
          visibleMonth={visibleMonth}
          selectedTypes={selectedTypes}
          showEmptyState={showEmptyState}
          isMonthCollapsed={isMonthCollapsed}
          onMonthCollapsedToggle={toggleMonthCollapsed}
          onProgrammaticScrollStart={beginProgrammaticScroll}
          onMonthChange={setVisibleMonth}
          onSelectedDayChange={setMobileSelectedDay}
          onToggleType={toggleTypeFilter}
          onActivityClick={handleActivityClick}
        />
      ) : (
        <div ref={desktopCalendarContainerRef} className="calendar-page__calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'today prev,next title',
              center: '',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            buttonText={{
              today: translate('actions.today'),
              month: translate('actions.month'),
              week: translate('actions.week'),
              day: translate('actions.day'),
              list: translate('actions.agenda'),
            }}
            initialView={CalendarViewName.MONTH}
            firstDay={0}
            height="auto"
            dayMaxEvents={true}
            listDayFormat={{ day: 'numeric', weekday: 'long' }}
            listDaySideFormat={false}
            noEventsContent={translate('empty_state')}
            eventOrder="sortIndex"
            eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
            slotLabelFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
            nowIndicator={true}
            nowIndicatorDidMount={(mountInfo) => {
              if (!mountInfo.isAxis && currentViewName.startsWith('timeGrid')) {
                pendingCurrentTimeFocus.current = true;
              }
            }}
            events={calendarEvents}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
          />
        </div>
      )}

      <button
        type="button"
        className={`calendar-page__fab${isMobileLayout && isMonthCollapsed ? ' calendar-page__fab--compact' : ''}`}
        aria-label={translate('actions.create_activity')}
        onClick={handleCreateActivity}
      >
        <DynamicIcons iconName="FaPlus" size={24} />
      </button>

      <ActivityFormDialog
        open={activityDialogOpen}
        draft={activityDraft}
        fullScreen={isMobileLayout}
        saveErrorMessage={showActivityError ? translate('activity_form.save_error') : undefined}
        onClose={() => setActivityDialogOpen(false)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />
    </div>
  );
};

export default CalendarPage;

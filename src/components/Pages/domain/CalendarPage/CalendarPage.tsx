import { DateSelectArg, DatesSetArg, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Alert } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectApiKey } from '~/common/slices/app-base/APIKey/selectors';
import { selectorActivities, useActivitiesSlice } from '~/common/slices/domain/activities/activities.redux';
import { selectorAgendaEvents, useAgendaEventsSlice } from '~/common/slices/domain/calendar/calendar.redux';
import { buildAgendaEventsQueryParams } from '~/common/slices/domain/calendar/types';
import { useI18n } from '~/common/utils';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PATHS, SUB_PATHS } from '~/constants';
import { ActivityTemplate, ActivityType } from '~/models/domain/activity/activity.model';
import {
  AgendaEventModel,
  AgendaEventType,
  VISIBLE_AGENDA_EVENT_TYPES,
} from '~/models/domain/calendar/agenda-event.model';
import { ActivityDraft, ActivityFormDialog } from './ActivityFormDialog';
import { TRANSLATION_BASE_CALENDAR_PAGE } from './calendar-page.constants';

import './CalendarPage.scss';

interface VisibleRange {
  from: string;
  to: string;
}

const DETAIL_ROUTE_BY_EVENT_TYPE: Partial<Record<AgendaEventType, string>> = {
  [AgendaEventType.CALL]: `/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}`,
  [AgendaEventType.CONCERT]: `/${PATHS.EVENTS}/${SUB_PATHS.ELEMENT_DETAILS}`,
};

const CalendarPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translateText } = useI18n();
  const { actions } = useAgendaEventsSlice();
  const { actions: activityActions } = useActivitiesSlice();

  const { apiKey } = useSelector(selectApiKey);
  const agendaEvents: AgendaEventModel[] = useSelector(selectorAgendaEvents.selectItems);
  const loading = useSelector(selectorAgendaEvents.selectLoading);
  const error = useSelector(selectorAgendaEvents.selectError);
  const activitySaving = useSelector(selectorActivities.selectLoading);
  const activityError = useSelector(selectorActivities.selectError);

  const [visibleRange, setVisibleRange] = useState<VisibleRange>();
  const [eventsRequested, setEventsRequested] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<AgendaEventType[]>(VISIBLE_AGENDA_EVENT_TYPES);
  const [activityDraft, setActivityDraft] = useState<ActivityDraft>();
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);
  const [showActivityError, setShowActivityError] = useState(false);

  // El slice genérico solo limpia `error` al crear, no al actualizar ni borrar: para saber si la
  // mutación en curso falló hay que comparar contra el error que ya estaba antes de lanzarla.
  const errorBeforeSaving = useRef(activityError);
  const wasSavingActivity = useRef(false);

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_CALENDAR_PAGE}.${key}`);

  const loadAgendaEvents = useCallback(() => {
    if (!apiKey || !visibleRange) {
      return;
    }

    const queryParams = buildAgendaEventsQueryParams({ ...visibleRange, types: VISIBLE_AGENDA_EVENT_TYPES });
    dispatch(actions.loadItems({ queryParams }));
    setEventsRequested(true);
  }, [apiKey, visibleRange]);

  useEffect(() => {
    loadAgendaEvents();
  }, [loadAgendaEvents]);

  useEffect(() => {
    if (savingActivity && wasSavingActivity.current && !activitySaving) {
      const savingFailed = !!activityError && activityError !== errorBeforeSaving.current;

      setSavingActivity(false);
      setShowActivityError(savingFailed);

      if (!savingFailed) {
        setActivityDialogOpen(false);
        loadAgendaEvents();
      }
    }

    wasSavingActivity.current = activitySaving;
  }, [activitySaving]);

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const from = dateInfo.start.toISOString();
    const to = dateInfo.end.toISOString();

    setVisibleRange((previousRange) =>
      previousRange?.from === from && previousRange?.to === to ? previousRange : { from, to }
    );
  };

  const buildTooltip = (agendaEvent: AgendaEventModel, title: string): string => {
    const { meta } = agendaEvent;
    const tooltipLines = [`${translate(`types.${agendaEvent.type}`)} · ${title}`];

    if (agendaEvent.isExpired) {
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

  const calendarEvents: EventInput[] = useMemo(() => {
    const buildCalendarEvent = (agendaEvent: AgendaEventModel): EventInput => {
      const title = agendaEvent.isDeadline ? `${translate('deadline_label')}: ${agendaEvent.title}` : agendaEvent.title;

      return {
        id: agendaEvent.identifier,
        title,
        start: agendaEvent.start,
        end: agendaEvent.isDeadline ? undefined : agendaEvent.end || undefined,
        allDay: agendaEvent.isDeadline || agendaEvent.allDay,
        classNames: [
          'agenda-event',
          `agenda-event--${agendaEvent.type}`,
          ...(agendaEvent.isExpired ? ['agenda-event--expired'] : []),
        ],
        extendedProps: {
          tooltip: buildTooltip(agendaEvent, title),
          agendaEventType: agendaEvent.type,
        },
      };
    };

    return agendaEvents
      .filter((agendaEvent) => !!agendaEvent && selectedTypes.includes(agendaEvent.type))
      .map(buildCalendarEvent);
  }, [agendaEvents, selectedTypes]);

  const openActivityForm = (draft: ActivityDraft) => {
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

  const handleEventClick = (clickInfo: EventClickArg) => {
    const agendaEvent = agendaEvents.find((item) => item?.identifier === clickInfo.event.id);

    if (!agendaEvent) {
      return;
    }

    if (agendaEvent.type === AgendaEventType.ACTIVITY) {
      openActivityForm({
        id: agendaEvent.id,
        title: agendaEvent.title,
        type: agendaEvent.meta?.activity_type as ActivityType,
        start: agendaEvent.start,
        end: agendaEvent.end,
        allDay: agendaEvent.allDay,
        notes: agendaEvent.meta?.notes,
      });
      return;
    }

    const detailRoute = DETAIL_ROUTE_BY_EVENT_TYPE[agendaEvent.type];

    if (detailRoute) {
      navigate(`${detailRoute}/${agendaEvent.id}`);
    }
  };

  const startActivityMutation = () => {
    errorBeforeSaving.current = activityError;
    setShowActivityError(false);
    setSavingActivity(true);
  };

  const handleSaveActivity = (activity: ActivityTemplate) => {
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

  const toggleTypeFilter = (eventType: AgendaEventType) => {
    setSelectedTypes((previousTypes) =>
      previousTypes.includes(eventType)
        ? previousTypes.filter((selectedType) => selectedType !== eventType)
        : [...previousTypes, eventType]
    );
  };

  const showEmptyState = eventsRequested && !loading && !error && !calendarEvents.length;

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div className="agenda-event__content" title={eventInfo.event.extendedProps.tooltip}>
      {!!eventInfo.timeText && <span className="agenda-event__time">{eventInfo.timeText}</span>}
      <span className="agenda-event__title">{eventInfo.event.title}</span>
    </div>
  );

  return (
    <div className="calendar-page">
      <h1 className="calendar-page__title">{translate('title')}</h1>

      <ul className="calendar-page__legend">
        {VISIBLE_AGENDA_EVENT_TYPES.map((eventType) => (
          <li key={eventType}>
            <button
              type="button"
              aria-pressed={selectedTypes.includes(eventType)}
              className={`calendar-page__legend-item calendar-page__legend-item--${eventType} ${
                selectedTypes.includes(eventType) ? '' : 'calendar-page__legend-item--off'
              }`.trim()}
              onClick={() => toggleTypeFilter(eventType)}
            >
              {translate(`types.${eventType}`)}
            </button>
          </li>
        ))}
      </ul>

      {!!error && <Alert severity="error">{translate('error')}</Alert>}

      {loading && <AppLoader />}

      {showEmptyState && <p className="calendar-page__empty">{translate('empty_state')}</p>}

      <div className="calendar-page__calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'today prev,next title',
            center: '',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: translate('actions.today'),
            month: translate('actions.month'),
            week: translate('actions.week'),
            day: translate('actions.day'),
          }}
          initialView="dayGridMonth"
          dayMaxEvents={true}
          events={calendarEvents}
          eventContent={renderEventContent}
          datesSet={handleDatesSet}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </div>

      <ActivityFormDialog
        open={activityDialogOpen}
        draft={activityDraft}
        saveErrorMessage={showActivityError ? translate('activity_form.save_error') : undefined}
        onClose={() => setActivityDialogOpen(false)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />
    </div>
  );
};

export default CalendarPage;

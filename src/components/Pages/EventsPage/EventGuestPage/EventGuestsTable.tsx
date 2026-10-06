import { Alert, Button, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { isDayjs } from 'dayjs';
import { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '~/common/utils';
import { getGenderOptions } from '~/common/utils/form-options';
import { removeSpecialChars } from '~/common/utils/string-utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { TableView } from '~/components/shared/atoms/Table/TableView';
import { FixedHeader } from '~/components/shared/molecules/FixedHeader';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { DEFAULT_TICKET_CURRENCY, EventGuestModel, formatTicketPrice } from '~/models/domain/event-guest/v1';
import {
  CHECK_IN_ACTION_FIELD,
  CHECK_IN_STATUS_FIELD,
  EVENT_GUEST_CARD_FIELDS,
  EVENT_GUEST_SEARCHABLE_FIELDS,
  EVENT_GUEST_TABLE_COLUMNS,
  SEARCH_INDEX_FIELD,
  TICKET_PRICE_VALUE_FIELD,
  TRANSLATION_BASE_EVENT_GUEST_TABLE,
} from './config-event-guest';

interface EventGuestsTableProps {
  guests: EventGuestModel[];
  showsAllGuests?: boolean;
  onRegisterEntry?: (guestId: string) => void;
  isRegisteringEntry?: boolean;
  registerEntryError?: string;
  onDismissRegisterEntryError?: () => void;
}

const buildOptionLabelMap = (options: SelectOption[]): Record<string, string> =>
  options.reduce((labels, option) => ({ ...labels, [option.value]: option.label }), {} as Record<string, string>);

export const EventGuestsTable = (props: EventGuestsTableProps) => {
  const {
    guests,
    showsAllGuests,
    onRegisterEntry,
    isRegisteringEntry,
    registerEntryError,
    onDismissRegisterEntryError,
  } = props;

  const { translateText, translateGlobalDict } = useI18n();

  const [searchTerm, setSearchTerm] = useState('');
  const [pendingEntryRow, setPendingEntryRow] = useState<Record<string, any>>();
  const summaryRef = useRef<HTMLDivElement>(null);

  const wasRegisteringEntryRef = useRef(false);

  const cancelPendingEntry = useCallback(() => {
    setPendingEntryRow(undefined);
    onDismissRegisterEntryError?.();
  }, [onDismissRegisterEntryError]);

  useEffect(() => {
    if (wasRegisteringEntryRef.current && !isRegisteringEntry && !registerEntryError) {
      setPendingEntryRow(undefined);
    }

    wasRegisteringEntryRef.current = !!isRegisteringEntry;
  }, [isRegisteringEntry, registerEntryError]);

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_EVENT_GUEST_TABLE}.${key}`);

  const genderLabels = useMemo(
    () => buildOptionLabelMap(getGenderOptions({ translateFn: translateGlobalDict })),
    [translateGlobalDict]
  );

  const rows: Record<string, any>[] = useMemo(
    () =>
      (guests || []).map((guest) => {
        const row: Record<string, any> = {
          id: guest.identifier,
          first_name: guest.first_name,
          last_name: guest.last_name,
          cc: guest.cc,
          email: guest.email,
          gender: guest.gender ? genderLabels[guest.gender] || guest.gender : '',
          ticket_type_name: guest.ticket_type_name,
          ticket_price: guest.formattedTicketPrice,
          registrationDate: guest.registrationDate,
          checked_in: guest.isCheckedIn,
          checkInDate: guest.checkInDate,
        };

        row[CHECK_IN_STATUS_FIELD] = guest.isCheckedIn
          ? translate('checkIn.statusDone')
          : translate('checkIn.statusPending');
        row[TICKET_PRICE_VALUE_FIELD] = guest.ticket_price || 0;
        row[SEARCH_INDEX_FIELD] = removeSpecialChars(
          EVENT_GUEST_SEARCHABLE_FIELDS.map((field) => row[field] || '').join(' ')
        );

        return row;
      }),
    [guests, genderLabels, translateText]
  );

  const normalizedSearchTerm = removeSpecialChars(searchTerm.trim()) || '';

  const filteredRows = useMemo(
    () => (normalizedSearchTerm ? rows.filter((row) => row[SEARCH_INDEX_FIELD].includes(normalizedSearchTerm)) : rows),
    [rows, normalizedSearchTerm]
  );

  const handleSearchChange = useCallback(
    (changeEvent: ChangeEvent<HTMLInputElement>) => setSearchTerm(changeEvent.target.value),
    []
  );

  const totals = useMemo(() => {
    const byTicketType = new Map<string, { count: number; amount: number }>();
    let totalCount = 0;
    let totalAmount = 0;
    let checkedInCount = 0;

    for (const row of rows) {
      const ticketTypeName = row.ticket_type_name || '';
      const amount = row[TICKET_PRICE_VALUE_FIELD];
      const current = byTicketType.get(ticketTypeName) || { count: 0, amount: 0 };

      current.count += 1;
      current.amount += amount;
      byTicketType.set(ticketTypeName, current);

      totalCount += 1;
      totalAmount += amount;

      if (row.checked_in) {
        checkedInCount += 1;
      }
    }

    return {
      byTicketType: [...byTicketType.entries()].map(([name, values]) => ({ name, ...values })),
      totalCount,
      totalAmount,
      checkedInCount,
    };
  }, [rows]);

  const renderCardValue = (value: any) => (isDayjs(value) ? value.format('DD/MM/YYYY') : value);

  const openEntryConfirmation = useCallback(
    (row: Record<string, any>) => {
      if (!onRegisterEntry || row.checked_in) {
        return;
      }

      onDismissRegisterEntryError?.();
      setPendingEntryRow(row);
    },
    [onRegisterEntry, onDismissRegisterEntryError]
  );

  const confirmPendingEntry = useCallback(() => {
    if (pendingEntryRow) {
      onRegisterEntry?.(pendingEntryRow.id);
    }
  }, [onRegisterEntry, pendingEntryRow]);

  const renderSummary = (isCompact = false) => (
    <section
      className={['event-guest-page__totals', isCompact ? 'event-guest-page__totals--compact' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {!isCompact && <h3 className="event-guest-page__totals-title">{translate('totals.title')}</h3>}

      <dl className="event-guest-page__totals-list">
        {totals.byTicketType.map((ticketTypeTotal) => (
          <div key={ticketTypeTotal.name} className="event-guest-page__totals-row">
            <dt>
              {ticketTypeTotal.name} ({ticketTypeTotal.count})
            </dt>
            <dd>{formatTicketPrice(ticketTypeTotal.amount, DEFAULT_TICKET_CURRENCY)}</dd>
          </div>
        ))}

        <div className="event-guest-page__totals-row event-guest-page__totals-row--grand">
          <dt>
            {translate('totals.grandTotal')} ({totals.totalCount})
          </dt>
          <dd>{formatTicketPrice(totals.totalAmount, DEFAULT_TICKET_CURRENCY)}</dd>
        </div>

        <div className="event-guest-page__totals-row event-guest-page__totals-row--check-in">
          <dt>{translate('totals.checkedIn')}</dt>
          <dd>
            {totals.checkedInCount} / {totals.totalCount}
          </dd>
        </div>
      </dl>
    </section>
  );

  const renderCheckInCell = (row: Record<string, any>) => {
    if (row.checked_in) {
      return (
        <div className="event-guest-page__check-in-registered">
          <span className="event-guest-page__check-in-registered-label">{translate('checkIn.registeredAt')}</span>

          <span className="event-guest-page__check-in-registered-value">
            {isDayjs(row.checkInDate) ? row.checkInDate.format('DD/MM/YYYY hh:mm A') : translate('checkIn.statusDone')}
          </span>
        </div>
      );
    }

    if (!onRegisterEntry) {
      return null;
    }

    return (
      <Button
        variant="contained"
        size="small"
        onClick={(clickEvent: MouseEvent<HTMLButtonElement>) => {
          clickEvent.stopPropagation();
          openEntryConfirmation(row);
        }}
      >
        {translate('checkIn.action')}
      </Button>
    );
  };

  const tableColumns = useMemo(() => [...EVENT_GUEST_TABLE_COLUMNS, CHECK_IN_ACTION_FIELD], []);

  const renderResults = () => {
    if (!filteredRows.length) {
      return <p className="event-guest-page__guests-empty">{translate('noResultsMessage')}</p>;
    }

    const tableRows = filteredRows.map((row) => ({ ...row, [CHECK_IN_ACTION_FIELD]: renderCheckInCell(row) }));

    return (
      <>
        <div className="event-guest-page__guests-table">
          <TableView
            config={{
              columns: tableColumns,
              rows: tableRows,
              stickyLastColumn: true,
              translationBasePath: `${TRANSLATION_BASE_EVENT_GUEST_TABLE}.columns`,
              onRowClick: onRegisterEntry ? openEntryConfirmation : undefined,
            }}
          />
        </div>

        <ul className="event-guest-page__guests-cards">
          {filteredRows.map((row) => (
            <li key={row.id} className="event-guest-page__guest-card">
              <p className="event-guest-page__guest-card-name">{[row.first_name, row.last_name].join(' ')}</p>

              <dl className="event-guest-page__guest-card-fields">
                {EVENT_GUEST_CARD_FIELDS.filter((field) => !!row[field]).map((field) => (
                  <div key={field} className="event-guest-page__guest-card-field">
                    <dt>{translate(`columns.${field}`)}</dt>
                    <dd>{renderCardValue(row[field])}</dd>
                  </div>
                ))}
              </dl>

              {renderCheckInCell(row)}
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <section className="event-guest-page__guests">
      <h2 className="event-guest-page__guests-title">
        {translate(showsAllGuests ? 'allGuestsTitle' : 'title')}
      </h2>

      {rows.length ? (
        <>
          <div ref={summaryRef}>{renderSummary()}</div>

          <FixedHeader
            mainHeaderRef={summaryRef}
            className="event-guest-page__totals-fixed"
            actionsButton={false}
          >
            {renderSummary(true)}
          </FixedHeader>

          <TextField
            className="event-guest-page__guests-search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={translate('searchPlaceholder')}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DynamicIcons iconName="MdSearch" />
                </InputAdornment>
              ),
            }}
          />
          {renderResults()}
        </>
      ) : (
        <p className="event-guest-page__guests-empty">
          {translate(showsAllGuests ? 'allGuestsEmptyMessage' : 'emptyMessage')}
        </p>
      )}

      <AppDialog
        isOpenDialog={!!pendingEntryRow}
        onClose={isRegisteringEntry ? (): void => undefined : cancelPendingEntry}
        title={translate('checkIn.confirmTitle')}
        content={
          <div className="event-guest-page__check-in-confirmation">
            <p>{translate('checkIn.confirmIntro')}</p>

            <dl className="event-guest-page__check-in-details">
              <div className="event-guest-page__check-in-detail">
                <dt>{translate('columns.first_name')}</dt>
                <dd>{[pendingEntryRow?.first_name, pendingEntryRow?.last_name].filter(Boolean).join(' ')}</dd>
              </div>

              <div className="event-guest-page__check-in-detail">
                <dt>{translate('columns.cc')}</dt>
                <dd>{pendingEntryRow?.cc}</dd>
              </div>

              {!!pendingEntryRow?.ticket_type_name && (
                <div className="event-guest-page__check-in-detail">
                  <dt>{translate('columns.ticket_type_name')}</dt>
                  <dd>{pendingEntryRow.ticket_type_name}</dd>
                </div>
              )}
            </dl>

            <p className="event-guest-page__check-in-warning">{translate('checkIn.confirmWarning')}</p>

            {!!registerEntryError && <Alert severity="error">{registerEntryError}</Alert>}

            <div className="event-guest-page__check-in-actions">
              <Button onClick={cancelPendingEntry} disabled={isRegisteringEntry}>
                {translate('checkIn.cancelLabel')}
              </Button>

              <Button
                variant="contained"
                onClick={confirmPendingEntry}
                disabled={isRegisteringEntry}
                startIcon={isRegisteringEntry ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {translate(isRegisteringEntry ? 'checkIn.savingLabel' : 'checkIn.confirmLabel')}
              </Button>
            </div>
          </div>
        }
      />
    </section>
  );
};

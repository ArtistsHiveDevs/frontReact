import { Button, InputAdornment, TextField } from '@mui/material';
import { isDayjs } from 'dayjs';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useI18n } from '~/common/utils';
import { removeSpecialChars } from '~/common/utils/string-utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { TableView } from '~/components/shared/atoms/Table/TableView';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DEFAULT_TICKET_CURRENCY, EventGuestModel, formatTicketPrice } from '~/models/domain/event-guest/v1';
import {
  EVENT_GUEST_CARD_FIELDS,
  EVENT_GUEST_SEARCHABLE_FIELDS,
  EVENT_GUEST_TABLE_COLUMNS,
  SEARCH_INDEX_FIELD,
  TICKET_PRICE_VALUE_FIELD,
  TRANSLATION_BASE_EVENT_GUEST_TABLE,
} from './config-event-guest';

interface EventGuestsTableProps {
  guests: EventGuestModel[];
  onRegisterEntry?: (guestId: string) => void;
}

export const EventGuestsTable = (props: EventGuestsTableProps) => {
  const { guests, onRegisterEntry } = props;

  const { translateText } = useI18n();

  const [searchTerm, setSearchTerm] = useState('');
  const [pendingEntryRow, setPendingEntryRow] = useState<Record<string, any>>();

  const cancelPendingEntry = useCallback(() => setPendingEntryRow(undefined), []);

  const rows: Record<string, any>[] = useMemo(
    () =>
      (guests || []).map((guest) => {
        const row: Record<string, any> = {
          id: guest.id,
          first_name: guest.first_name,
          last_name: guest.last_name,
          cc: guest.cc,
          email: guest.email,
          ticket_type_name: guest.ticket_type_name,
          ticket_price: guest.formattedTicketPrice,
          registrationDate: guest.registrationDate,
        };

        row[TICKET_PRICE_VALUE_FIELD] = guest.ticket_price || 0;
        row[SEARCH_INDEX_FIELD] = removeSpecialChars(
          EVENT_GUEST_SEARCHABLE_FIELDS.map((field) => row[field] || '').join(' ')
        );

        return row;
      }),
    [guests]
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

    for (const row of filteredRows) {
      const ticketTypeName = row.ticket_type_name || '';
      const amount = row[TICKET_PRICE_VALUE_FIELD];
      const current = byTicketType.get(ticketTypeName) || { count: 0, amount: 0 };

      current.count += 1;
      current.amount += amount;
      byTicketType.set(ticketTypeName, current);

      totalCount += 1;
      totalAmount += amount;
    }

    return {
      byTicketType: [...byTicketType.entries()].map(([name, values]) => ({ name, ...values })),
      totalCount,
      totalAmount,
    };
  }, [filteredRows]);

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_EVENT_GUEST_TABLE}.${key}`);

  const renderCardValue = (value: any) => (isDayjs(value) ? value.format('DD/MM/YYYY') : value);

  const renderResults = () => {
    if (!filteredRows.length) {
      return <p className="event-guest-page__guests-empty">{translate('noResultsMessage')}</p>;
    }

    return (
      <>
        <div className="event-guest-page__guests-table">
          <TableView
            config={{
              columns: EVENT_GUEST_TABLE_COLUMNS,
              rows: filteredRows,
              translationBasePath: `${TRANSLATION_BASE_EVENT_GUEST_TABLE}.columns`,
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

              <Button variant="contained" size="small" onClick={() => setPendingEntryRow(row)}>
                Registrar ingreso
              </Button>
            </li>
          ))}
        </ul>

        <section className="event-guest-page__totals">
          <h3 className="event-guest-page__totals-title">{translate('totals.title')}</h3>

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
          </dl>
        </section>
      </>
    );
  };

  return (
    <section className="event-guest-page__guests">
      <h2 className="event-guest-page__guests-title">{translate('title')}</h2>

      {rows.length ? (
        <>
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
        <p className="event-guest-page__guests-empty">{translate('emptyMessage')}</p>
      )}

      <AppDialog
        isOpenDialog={!!pendingEntryRow}
        onClose={cancelPendingEntry}
        title="Confirmar ingreso"
        content={
          <p>
            Vas a registrar el ingreso de <br />
            <br />
            <strong>{[pendingEntryRow?.first_name, pendingEntryRow?.last_name].join(' ')}</strong>
            {pendingEntryRow?.cc ? (
              <>
                {' '}
                (documento: <strong>{pendingEntryRow.cc}</strong>)
              </>
            ) : null}
            {pendingEntryRow?.ticket_type_name ? (
              <>
                <br />
                Entrada: <strong>{pendingEntryRow.ticket_type_name}</strong>
              </>
            ) : null}
            <br />
            <br />
            ¿Deseas continuar?
          </p>
        }
        actions={[
          { label: 'Cancelar', handler: cancelPendingEntry },
          {
            label: 'Confirmar',
            handler: () => {
              onRegisterEntry?.(pendingEntryRow!.id);
              setPendingEntryRow(undefined);
            },
          },
        ]}
      />
    </section>
  );
};

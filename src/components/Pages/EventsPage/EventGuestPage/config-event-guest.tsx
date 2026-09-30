import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';
import { SocialNetworks } from '~/constants/social-networks.const';

export const TRANSLATION_BASE_EVENT_GUEST_PAGE = 'app.pages.EventsPages.EventGuestPage';

export const SEARCH_INDEX_FIELD = 'searchIndex';

export const TICKET_PRICE_VALUE_FIELD = 'ticketPriceValue';

export const TRANSLATION_BASE_EVENT_GUEST_TABLE = `${TRANSLATION_BASE_EVENT_GUEST_PAGE}.guestsTable`;

export const EVENT_GUEST_TABLE_COLUMNS = [
  'first_name',
  'last_name',
  'cc',
  'email',
  'ticket_type_name',
  'ticket_price',
  'registrationDate',
];

export const EVENT_GUEST_CARD_FIELDS = ['cc', 'email', 'ticket_type_name', 'ticket_price', 'registrationDate'];

export const EVENT_GUEST_SEARCHABLE_FIELDS = ['first_name', 'last_name', 'cc', 'email', 'ticket_type_name'];

export const EVENT_GUEST_FORM_FIELDS: DynamicFieldData[] = [
  {
    fieldName: 'first_name',
    inputType: 'text',
    label: 'first_name',
    defaultValue: '',
    config: { required: true },
  },
  {
    fieldName: 'last_name',
    inputType: 'text',
    label: 'last_name',
    defaultValue: '',
    config: { required: true },
  },
  {
    fieldName: 'cc',
    inputType: 'text',
    label: 'cc',
    defaultValue: '',
    config: { required: true },
  },
  {
    fieldName: 'email',
    inputType: 'email',
    label: 'email',
    defaultValue: '',
    config: {
      required: false,
      pattern: {
        value: SocialNetworks.email.usernamePattern,
        message: `${TRANSLATION_BASE_EVENT_GUEST_PAGE}.errors.invalidEmail`,
      },
    },
  },
  {
    fieldName: 'ticket_type_id',
    inputType: 'select',
    label: 'ticket_type_id',
    config: { required: true },
  },
];

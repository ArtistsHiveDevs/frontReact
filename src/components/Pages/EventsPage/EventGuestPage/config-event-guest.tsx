import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';

export const TRANSLATION_BASE_EVENT_GUEST_PAGE = 'app.pages.EventsPages.EventGuestPage';

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
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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

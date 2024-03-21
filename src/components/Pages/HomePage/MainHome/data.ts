import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';

export const fields: DynamicFieldData[] = [
  {
    fieldName: 'name',
    inputType: 'text',
    label: 'Name',
    defaultValue: '',
    config: {
      required: 'Required',
      pattern: { value: /^\S+@\S+$/i, message: 'Not an email??' },
      minLength: { value: 2, message: 'Minimum 2 chjars' },
    },
  },
  {
    fieldName: 'age',
    inputType: 'number',
    label: 'Age',
    defaultValue: 18,
    config: {
      required: 'Required',
      validate: (value) => value >= 18 || 'Still a minor',
      min: { value: -7, message: 'Less value is -7' },
      max: { value: 45, message: 'Máx value is 45' },
    },
  },
  {
    fieldName: 'pass',
    inputType: 'password',
    label: 'Pass',
    defaultValue: '',
    config: {
      required: 'Required',
      // validate: (value) => value >= 18 || "Still a minor",
      minLength: { value: 6, message: 'Min 6 chars' },
      pattern: {
        value: /^[0-9]{3}(?<=^|[^\/])([A-Za-z0-9_.]{2,24})$/,
        message: 'Not good pass',
      },
    },
  },
  {
    fieldName: 'phone',
    inputType: 'tel',
    label: 'Phone',
    defaultValue: 18,
    config: {
      required: 'Required',
      minLength: { value: 10, message: 'Min10' },
      maxLength: { value: 10, message: 'Máx 10' },
    },
  },
  {
    fieldName: 'language',
    inputType: 'select',
    label: 'Language',
    options: [
      { value: 'english', label: 'English' },
      { value: 'french', label: 'French' },
    ],
    defaultValue: 'french',
  },
  {
    fieldName: 'country',
    inputType: 'select',
    label: 'Country',
    options: [
      { value: 'CO', label: 'Colombia' },
      { value: 'PE', label: 'Perú' },
      { value: 'AR', label: 'Argentina' },
      { value: 'BR', label: 'Brazil' },
    ],
  },
  {
    fieldName: 'province',
    inputType: 'select',
    label: 'Province',
    options: [],
  },
  {
    fieldName: 'address',
    inputType: 'address',
    label: 'Address New',
    defaultValue: '',
  },
  {
    fieldName: 'instagram',
    inputType: 'socialNetwork',
  },
  {
    fieldName: 'facebook',
    inputType: 'socialNetwork',
  },
  {
    fieldName: 'tiktok',
    inputType: 'socialNetwork',
  },
  {
    fieldName: 'temperature',
    inputType: 'range',
    label: 'Temp',
    defaultValue: 2,
    componentParams: {
      step: 3,
    },
  },
];

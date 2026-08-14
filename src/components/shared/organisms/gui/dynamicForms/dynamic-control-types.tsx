import React from 'react';
import { FieldErrors, FieldValues, RegisterOptions } from 'react-hook-form';

export type ControlType =
  | 'address'
  | 'text'
  | 'select'
  | 'number'
  | 'password'
  | 'textarea'
  | 'tel'
  | 'phonePrefix'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'range'
  | 'interval'
  | 'url'
  | 'time'
  | 'date'
  | 'dateInterval'
  | 'datetime'
  | 'month'
  | 'week'
  | 'socialNetwork'
  | 'file'
  | 'citySelector'
  | 'chipPicker'
  | 'autocompletePicker'
  | 'relationship'
  | 'hidden'
  | 'instrumentSelector'
  | 'iconTextButton'
  | 'membersList';

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode; // Can be a JSX element (like <Flag />) or a string
  iconColor?: string;
  required?: boolean;
  selected?: boolean;
}

export interface DynamicFieldData {
  label?: string;
  icon?: string;
  inputType: ControlType;
  fieldName: string;
  fieldNamePrefix?: string;
  defaultValue?: any;
  placeholder?: string;
  options?: SelectOption[];
  config?: RegisterOptions;
  componentParams?: any;
  handlersNames?: string[];
  error?: FieldErrors<FieldValues>;
  focused?: boolean;
  externalData?: any;
}

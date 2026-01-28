import { FieldErrors, FieldValues, RegisterOptions } from 'react-hook-form';

export type ControlType =
  | 'address'
  | 'text'
  | 'select'
  | 'number'
  | 'password'
  | 'textarea'
  | 'tel'
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
  | 'relationship'
  | 'hidden'
  | 'instrumentSelector'
  | 'iconTextButton';

export interface SelectOption {
  label: string;
  value: string;
  icon?: string;
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

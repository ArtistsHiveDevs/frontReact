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
  | 'url'
  | 'time'
  | 'date'
  | 'datetime'
  | 'month'
  | 'week'
  | 'socialNetwork'
  | 'file'
  | 'citySelector'
  | 'chipPicker';

export interface SelectOption {
  label: string;
  value: string;
  required?: boolean;
  selected?: boolean;
}

export interface DynamicFieldData {
  label?: string;
  inputType: ControlType;
  fieldName: string;
  defaultValue?: any;
  placeholder?: string;
  options?: SelectOption[];
  config?: RegisterOptions;
  componentParams?: any;
  handlersNames?: string[];
  error?: FieldErrors<FieldValues>;
  focused?: boolean;
}

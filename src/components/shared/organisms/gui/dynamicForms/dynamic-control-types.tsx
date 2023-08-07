import { FieldErrors, FieldValues, RegisterOptions } from "react-hook-form";

export type ControlType =
  | "text"
  | "select"
  | "number"
  | "checkbox"
  | "password"
  | "radio"
  | "textarea"
  | "tel"
  | "range"
  | "url"
  | "time"
  | "date"
  | "datetime"
  | "month"
  | "week"
  | "socialNetwork";

export interface SelectOption {
  label: string;
  value: string;
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
}

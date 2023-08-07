import { useEffect } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  useController,
  useFormContext,
} from "react-hook-form";
import { DynamicFieldData } from "../dynamic-control-types";

import Select from "react-select";

export const createSelect = (params: {
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers: { [handlerName: string]: Function };
}) => {
  const { register, fieldData, errors, handlers } = params;
  const {
    label,
    fieldName,
    defaultValue,
    placeholder = "",
    options = [],
    config = {},
    componentParams = {},
  } = params.fieldData;

  const { control, setValue } = useFormContext();

  const dispatchHandler = (data: { value: string; label?: string }) => {
    if (data && Object.keys(handlers).indexOf(`onChange${fieldName}`) >= 0) {
      handlers[`onChange${fieldName}`](data);
    }
  };

  const resetDefaultValue = (data?: { value: string; label?: string }) => {
    const newValue = data?.value || defaultValue || options[0]?.value || "";
    setValue(fieldName, newValue);
    langValue = newValue;
  };

  const handleChange = (data: any) => {
    resetDefaultValue(data);
    dispatchHandler(data);
  };

  useEffect(() => {
    const newValue = defaultValue || options[0]?.value || "";

    handleChange({ value: newValue });
  }, [options]);

  useEffect(() => {
    const newValue = defaultValue || options[0]?.value || "";
    handleChange({ value: newValue });
  }, [defaultValue]);

  let {
    field: {
      value: langValue,
      onChange: langOnChange,
      ref,
      ...restSelectField
    },
  } = useController({ name: fieldName, control });

  if (!langValue) {
    langValue = defaultValue || options[0]?.value || "";
  }

  return (
    <div>
      <label>{label}</label>
      <Select
        ref={ref}
        className="select-input"
        name={fieldName}
        placeholder={placeholder}
        options={options}
        value={
          langValue ? options.find((x) => x.value === langValue) : langValue
        }
        key={`select_${fieldName}`}
        onChange={(option) => {
          langOnChange(option ? option.value : option);
          langValue = option.value;
          handleChange(option);
        }}
        {...restSelectField}
      />
    </div>
  );
};

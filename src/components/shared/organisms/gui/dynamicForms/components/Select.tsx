import { useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";

import { FormLabel } from "@mui/material";
import Select from "react-select";
import { ComponentGeneratorParams } from "../DynamicControl";

export const createSelect = (params: ComponentGeneratorParams) => {
  const { register, fieldData, errors, handlers } = params;
  const {
    label,
    fieldName,
    defaultValue,
    placeholder = "",
    options = [],
    config = {},
    componentParams = {},
  } = fieldData;

  const { required } = config || {};

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
      <FormLabel
        required={required === true || required === "true"}
        error={!!Object.keys(errors || {}).find((key) => key === fieldName)}
      >
        {label}
      </FormLabel>
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
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
    </div>
  );
};

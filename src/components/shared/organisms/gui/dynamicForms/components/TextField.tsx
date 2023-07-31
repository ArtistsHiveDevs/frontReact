import { TextField } from "@mui/material";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { DynamicFieldData } from "../dynamic-control-types";

export const createTextField = (
  register: UseFormRegister<FieldValues>,
  {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = "",
    options = [],
    config = {},
    componentParams = {},
  }: DynamicFieldData,
  errors: FieldErrors<FieldValues>
) => {
  //   const numberLimits = { inputProps: {} };
  const numberLimits: { inputProps: { max?: number; min?: number } } = {
    inputProps: {},
  };

  if (inputType === "number") {
    if (!!config?.min) {
      if (typeof config.min === "number") {
        numberLimits.inputProps.min = config.min;
      } else {
        numberLimits.inputProps.min = config.min.value;
      }
    }
    if (!!config?.max) {
      if (typeof config.max === "number") {
        numberLimits.inputProps.max = config.max;
      } else {
        numberLimits.inputProps.max = config.max.value;
      }
    }
  }

  return (
    <TextField
      label={label}
      type={inputType}
      {...register(fieldName, config)}
      defaultValue={defaultValue}
      placeholder={placeholder}
      error={!!errors[fieldName]}
      helperText={errors[fieldName]?.message?.toString()}
      InputProps={numberLimits}
      fullWidth
    />
  );
};

import { InputLabel, MenuItem, Select } from "@mui/material";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { DynamicFieldData } from "../dynamic-control-types";

export const createTimeField = (
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
  return (
    <>
      <InputLabel id={`label_${fieldName}`}>{label}</InputLabel>
      <Select
        {...register(fieldName, config)}
        labelId={fieldName}
        id={fieldName}
        name={fieldName}
        value={defaultValue}
        label={label}
        fullWidth
        // onChange={handleChange}
      >
        {options.map((o, index) => (
          <MenuItem key={index} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

import { InputLabel, Slider } from "@mui/material";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { DynamicFieldData } from "../dynamic-control-types";

export const createSlider = (
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
  const rangeLimits: { max?: number; min?: number; step?: number } = {};

  if (!!config?.min) {
    if (typeof config.min === "number") {
      rangeLimits.min = config.min;
    } else {
      rangeLimits.min = (config.min as any).value;
    }
  }
  if (!!config?.max) {
    if (typeof config.max === "number") {
      rangeLimits.max = config.max;
    } else {
      rangeLimits.max = (config.max as any).value;
    }
  }
  if (!!componentParams["step"]) {
    rangeLimits.step = componentParams["step"];
  }
  return (
    <>
      <InputLabel id={`label_${fieldName}`}>{label}</InputLabel>
      <Slider
        getAriaLabel={() => label}
        // value={value}
        // onChange={handleChange}
        valueLabelDisplay="auto"
        // getAriaValueText={valuetext}
        defaultValue={defaultValue}
        max={rangeLimits.max | 10}
        min={rangeLimits.min | 0}
        step={rangeLimits.step | 2}
      />
    </>
  );
};

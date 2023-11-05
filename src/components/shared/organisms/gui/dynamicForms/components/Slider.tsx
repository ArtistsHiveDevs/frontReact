import { InputLabel, Slider } from "@mui/material";
import { ComponentGeneratorParams } from "../DynamicControl";

export const createSlider = (params: ComponentGeneratorParams) => {
  const { fieldData, register } = params;

  const {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = "",
    options = [],
    config = {},
    componentParams = {},
  } = fieldData;

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

  config.valueAsNumber = true;

  return (
    <>
      <InputLabel id={`label_${fieldName}`}>{label}</InputLabel>
      <Slider
        {...register(fieldName, config)}
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

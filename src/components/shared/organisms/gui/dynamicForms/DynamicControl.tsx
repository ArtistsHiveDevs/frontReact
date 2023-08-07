import { FieldErrors, FieldValues, useFormContext } from "react-hook-form";
import { createSelect } from "./components/Select";
import { createSlider } from "./components/Slider";
import { createTextField } from "./components/TextField";
import { DynamicFieldData } from "./dynamic-control-types";

export const DynamicControl = (params: {
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers: { [handlerName: string]: Function };
  control?: any;
}) => {
  const { fieldData: fieldData, errors, handlers } = params;

  const { register } = useFormContext();

  const {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = "",
    options = [],
    config = {},
    componentParams = {},
  }: DynamicFieldData = fieldData;

  switch (inputType) {
    case "text":
    case "number":
    case "password":
    case "tel":
      return createTextField(register, fieldData, errors);
    case "select": {
      return createSelect({
        register,
        fieldData,
        errors,
        handlers,
      });
    }
    case "range": {
      return createSlider(register, fieldData, errors);
    }
    default:
      fieldData.inputType = "text";
      return createTextField(register, fieldData, errors);
  }
};

import { FieldErrors, FieldValues, useFormContext } from "react-hook-form";
import { createSelect } from "./components/Select";
import { createSlider } from "./components/Slider";
import { createTextField } from "./components/TextField";
import { DynamicFieldData } from "./dynamic-control-types";

export const DynamicControl = (params: {
  fields: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
}) => {
  const { fields, errors } = params;
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
  }: DynamicFieldData = fields;

  switch (inputType) {
    case "text":
    case "number":
    case "password":
    case "tel":
      return createTextField(register, fields, errors);
    case "select": {
      return createSelect(register, fields, errors);
    }
    case "range": {
      return createSlider(register, fields, errors);
    }
    default:
      fields.inputType = "text";
      return createTextField(register, fields, errors);
  }
};

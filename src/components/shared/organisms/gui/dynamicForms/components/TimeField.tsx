import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import {
  Controller,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  useForm,
  useFormContext,
} from "react-hook-form";
import { DynamicFieldData } from "../dynamic-control-types";

export const createTimeField = (params: {
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
}) => {
  const {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = "",
    options = [],
    config = {},
    componentParams = {},
  } = params?.fieldData || {};
  const { disablePast, disableFuture } = componentParams || {};

  const { control, handleSubmit } = useForm({
    defaultValues: {
      date: null as Dayjs | null,
    },
  });

  const { register, formState } = useFormContext();
  const { errors } = formState || {};
  if (register) {
    register(fieldName, config);
  }

  return (
    <>
      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <DatePicker
              label="Date"
              value={field.value}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
                config.value = date;
                register(fieldName, config);
              }}
              disablePast={disablePast}
              disableFuture={disableFuture}
              displayWeekNumber={componentParams?.displayWeekNumber}
              slotProps={{
                textField: {
                  required: !!config?.required,
                  error: !!errors[fieldName],
                },
              }}
            />
          );
        }}
      />
    </>
  );
};

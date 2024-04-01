import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Controller, FieldErrors, FieldValues, UseFormRegister, useForm, useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';
import { DynamicFieldData } from '../dynamic-control-types';

export const createDatePicker = (params: {
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
}) => {
  const {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = '',
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
              label={label}
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

export const createDatePickerAnterior = (params: ComponentGeneratorParams) => {
  const { fieldData, formContext } = params;
  const { register, control } = formContext;
  const {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = '',
    options = [],
    config = {},
    componentParams = {},
  } = fieldData;

  //   const rangeLimits: { max?: number; min?: number; step?: number } = {};

  //   if (!!config?.min) {
  //     if (typeof config.min === "number") {
  //       rangeLimits.min = config.min;
  //     } else {
  //       rangeLimits.min = (config.min as any).value;
  //     }
  //   }
  //   if (!!config?.max) {
  //     if (typeof config.max === "number") {
  //       rangeLimits.max = config.max;
  //     } else {
  //       rangeLimits.max = (config.max as any).value;
  //     }
  //   }
  //   if (!!componentParams["step"]) {
  //     rangeLimits.step = componentParams["step"];
  //   }

  const { disablePast, disableFuture } = componentParams;
  const isRequired = !!config?.required;
  const defaultDate = defaultValue; // isRequired ? defaultValue : undefined;
  const [selectedDate, setSelectedDate] = useState(defaultDate?.toISOString());
  //   console.log(fieldData);

  register(fieldName, { ...config, value: selectedDate });
  return (
    <Controller
      control={control}
      name={`fieldName_dp`}
      //   shouldUnregister={true}
      rules={{ required: isRequired }}
      render={({ field }) => {
        return (
          <DatePicker
            label={label}
            value={defaultDate}
            inputRef={field.ref}
            onChange={(date) => {
              setSelectedDate(date.toISOString());
              register(fieldName, { ...config, value: selectedDate });
              field.onChange(date);
            }}
            disableFuture={disableFuture}
            disablePast={disablePast}
            slotProps={{ textField: { fullWidth: true } }}
            displayWeekNumber={componentParams?.displayWeekNumber}
          />
        );
      }}
    />
    // <DatePicker
    //   {...register(fieldName, config)}

    // //   defaultValue={defaultValue}
    // />
  );
};

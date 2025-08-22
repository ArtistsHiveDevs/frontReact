import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Controller, FieldErrors, FieldValues, UseFormRegister, useForm, useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';
import { DynamicFieldData } from '../dynamic-control-types';

export const createDatePicker = (params: {
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers?: { [handlerName: string]: Function };
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

  // Convert defaultValue to dayjs object if it's a string or Date
  const parsedDefaultValue = defaultValue ? dayjs(defaultValue) : null;
  const parsedConfigValue = config?.value ? dayjs(config.value) : null;
  const [defaultTimeValue, setDefaultTimeValue] = useState<Dayjs | null>(parsedDefaultValue ?? parsedConfigValue ?? null);

  const { control, register: formRegister, formState, setValue } = useFormContext();
  const { errors } = formState || {};
  
  // Initialize form value with defaultValue
  if (parsedDefaultValue && formRegister) {
    setValue(fieldName, parsedDefaultValue);
  }

  return (
    <>
      <Controller
        control={control}
        name={fieldName}
        rules={{ required: !!config?.required }}
        render={({ field }) => {
          // Ensure we always have a dayjs object or null
          const resolvedValue = field.value ? dayjs(field.value) : defaultTimeValue;
          
          return (
            <DatePicker
              label={label}
              value={resolvedValue}
              inputRef={field.ref}
              onChange={(date: Dayjs | null) => {
                setValue(fieldName, date);
                field.onChange(date);

                if (params?.handlers?.[`${fieldName}_value_onchange`]) {
                  params?.handlers[`${fieldName}_value_onchange`](date);
                }
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
  const { register, control, setValue } = formContext;
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
  // Convert defaultValue to dayjs object if it's a string or Date
  const parsedDefaultDate = defaultValue ? dayjs(defaultValue) : null;
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(parsedDefaultDate);
  
  // Initialize form value with defaultValue
  if (parsedDefaultDate) {
    setValue(fieldName, parsedDefaultDate);
  }
  return (
    <Controller
      control={control}
      name={fieldName}
      rules={{ required: isRequired }}
      render={({ field }) => {
        // Ensure we always have a dayjs object or null
        const resolvedValue = field.value ? dayjs(field.value) : parsedDefaultDate;
        
        return (
          <DatePicker
            label={label}
            value={resolvedValue}
            inputRef={field.ref}
            onChange={(date: Dayjs | null) => {
              setSelectedDate(date);
              setValue(fieldName, date);
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

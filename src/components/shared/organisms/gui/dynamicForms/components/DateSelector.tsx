import { FormLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createDatePicker = (params: ComponentGeneratorParams) => {
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
  const {
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    minYearsAgo,
    maxYearsAgo,
    minAgeInYears,
    maxAgeInYears,
    defaultToMinAge,
    defaultToMaxAge,
  } = componentParams || {};

  /**
   * Calcula un valor por defecto inteligente basado en las restricciones de edad
   */
  const calculateSmartDefaultValue = (): Dayjs | null => {
    // Si hay un defaultValue explícito, usarlo
    if (defaultValue) return dayjs(defaultValue);

    // Si config tiene un valor, usarlo
    if (config?.value) return dayjs(config.value);

    // Si defaultToMinAge está activado y hay restricción de edad mínima
    if (defaultToMinAge && minAgeInYears) {
      return dayjs().subtract(minAgeInYears, 'year');
    }

    // Si defaultToMaxAge está activado y hay restricción de edad máxima
    if (defaultToMaxAge && maxAgeInYears) {
      return dayjs().subtract(maxAgeInYears, 'year');
    }

    // Si hay minYearsAgo, usar esa fecha
    if (defaultToMinAge && minYearsAgo) {
      return dayjs().subtract(minYearsAgo, 'year');
    }

    return null;
  };

  const smartDefaultValue = calculateSmartDefaultValue();
  const [defaultTimeValue, setDefaultTimeValue] = useState<Dayjs | null>(smartDefaultValue);

  /**
   * Calcula la fecha mínima permitida basada en los parámetros
   * minAgeInYears define la EDAD MÍNIMA → fecha MÁXIMA permitida (más reciente)
   * maxAgeInYears define la EDAD MÁXIMA → fecha MÍNIMA permitida (más antigua)
   * Prioridad: minDate > minYearsAgo > maxAgeInYears
   */
  const calculateMinDate = (): Dayjs | undefined => {
    if (minDate) {
      return dayjs(minDate);
    }
    if (minYearsAgo) {
      // Por ejemplo: minYearsAgo: 100 → hace 100 años desde hoy (fecha más antigua)
      return dayjs().subtract(minYearsAgo, 'year');
    }
    if (maxAgeInYears) {
      // Por ejemplo: maxAgeInYears: 120 → hace 120 años desde hoy (fecha más antigua = edad máxima)
      return dayjs().subtract(maxAgeInYears, 'year');
    }
    return undefined;
  };

  /**
   * Calcula la fecha máxima permitida basada en los parámetros
   * minAgeInYears define la EDAD MÍNIMA → fecha MÁXIMA permitida (más reciente)
   * Prioridad: maxDate > maxYearsAgo > minAgeInYears
   */
  const calculateMaxDate = (): Dayjs | undefined => {
    if (maxDate) {
      return dayjs(maxDate);
    }
    if (maxYearsAgo) {
      // Por ejemplo: maxYearsAgo: 18 → hace 18 años desde hoy (fecha más reciente)
      return dayjs().subtract(maxYearsAgo, 'year');
    }
    if (minAgeInYears) {
      // Por ejemplo: minAgeInYears: 18 → hace 18 años desde hoy (fecha más reciente = edad mínima)
      return dayjs().subtract(minAgeInYears, 'year');
    }
    return undefined;
  };

  const calculatedMinDate = calculateMinDate();
  const calculatedMaxDate = calculateMaxDate();

  const hookContext = useFormContext();
  const finalContext = params.formContext || hookContext;
  const { control, register: formRegister, formState, setValue } = finalContext;
  const { errors } = formState || {};

  // Initialize form value with smart default value
  if (smartDefaultValue && formRegister) {
    setValue(fieldName, smartDefaultValue);
  }

  return (
    <>
      {label && (
        <FormLabel
          required={!!config?.required}
          error={!!errors[fieldName]}
          sx={{ mb: 0.5, display: 'block', color: '#fff' }}
        >
          {label}
        </FormLabel>
      )}
      <Controller
        control={control}
        name={fieldName}
        rules={{ required: !!config?.required }}
        render={({ field }) => {
          // Ensure we always have a dayjs object or null
          const resolvedValue = field.value ? dayjs(field.value) : defaultTimeValue;

          return (
            <>
              <DatePicker
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
                minDate={calculatedMinDate}
                maxDate={calculatedMaxDate}
                displayWeekNumber={componentParams?.displayWeekNumber}
                slotProps={{
                  textField: {
                    required: !!config?.required,
                    error: !!errors[fieldName],
                    helperText: errors[fieldName]?.message as string,
                  },
                }}
              />
            </>
          );
        }}
      />
    </>
  );
};

export const createDatePickerAnterior = (params: ComponentGeneratorParams) => {
  const { fieldData, formContext: externalContext } = params;

  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { register, control, setValue } = finalContext;
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

  const {
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    minYearsAgo,
    maxYearsAgo,
    minAgeInYears,
    maxAgeInYears,
    defaultToMinAge,
    defaultToMaxAge,
  } = componentParams;

  const isRequired = !!config?.required;

  // Calculate smart default value
  const calculateSmartDefaultValue = (): Dayjs | null => {
    if (defaultValue) return dayjs(defaultValue);
    if (config?.value) return dayjs(config.value);

    if (defaultToMinAge && minAgeInYears) {
      return dayjs().subtract(minAgeInYears, 'year');
    }
    if (defaultToMaxAge && maxAgeInYears) {
      return dayjs().subtract(maxAgeInYears, 'year');
    }
    if (defaultToMinAge && minYearsAgo) {
      return dayjs().subtract(minYearsAgo, 'year');
    }

    return null;
  };

  const smartDefaultValue = calculateSmartDefaultValue();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(smartDefaultValue);

  // Calculate min/max dates
  const calculateMinDate = (): Dayjs | undefined => {
    if (minDate) return dayjs(minDate);
    if (minYearsAgo) return dayjs().subtract(minYearsAgo, 'year');
    if (maxAgeInYears) return dayjs().subtract(maxAgeInYears, 'year'); // maxAge → minDate (más antigua)
    return undefined;
  };

  const calculateMaxDate = (): Dayjs | undefined => {
    if (maxDate) return dayjs(maxDate);
    if (maxYearsAgo) return dayjs().subtract(maxYearsAgo, 'year');
    if (minAgeInYears) return dayjs().subtract(minAgeInYears, 'year'); // minAge → maxDate (más reciente)
    return undefined;
  };

  const calculatedMinDate = calculateMinDate();
  const calculatedMaxDate = calculateMaxDate();

  // Initialize form value with smart default value
  if (smartDefaultValue) {
    setValue(fieldName, smartDefaultValue);
  }
  return (
    <>
    {label && (
      <FormLabel
        required={isRequired}
        sx={{ mb: 0.5, display: 'block', color: '#fff' }}
      >
        {label}
      </FormLabel>
    )}
    <Controller
      control={control}
      name={fieldName}
      rules={{ required: isRequired }}
      render={({ field }) => {
        // Ensure we always have a dayjs object or null
        const resolvedValue = field.value ? dayjs(field.value) : smartDefaultValue;

        return (
          <DatePicker
            value={resolvedValue}
            inputRef={field.ref}
            onChange={(date: Dayjs | null) => {
              setSelectedDate(date);
              setValue(fieldName, date);
              field.onChange(date);
            }}
            disableFuture={disableFuture}
            disablePast={disablePast}
            minDate={calculatedMinDate}
            maxDate={calculatedMaxDate}
            slotProps={{ textField: { fullWidth: true } }}
            displayWeekNumber={componentParams?.displayWeekNumber}
          />
        );
      }}
    />
    </>
    // <DatePicker
    //   {...register(fieldName, config)}

    // //   defaultValue={defaultValue}
    // />
  );
};

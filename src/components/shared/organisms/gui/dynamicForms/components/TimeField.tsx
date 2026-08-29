import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createTimeField = (params: ComponentGeneratorParams) => {
  const { fieldData, formContext: externalContext } = params;
  const { label, fieldName, config = {}, componentParams = {} } = fieldData || {};
  const { disablePast, disableFuture, ampm } = componentParams || {};

  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { control, register, formState, setValue } = finalContext;
  const { errors } = formState || {};

  const defaultTimeValue = config?.value ? dayjs(config.value, 'HH:mm') : null;

  // Initialize with default value
  if (defaultTimeValue && register) {
    setValue(fieldName, defaultTimeValue);
  }

  return (
    <>
      <Controller
        control={control}
        name={fieldName}
        rules={{
          required: config.required ? `${label || 'This field'} is required` : false,
        }}
        render={({ field }) => (
          <MobileTimePicker
            {...field}
            label={label}
            value={field.value}
            onChange={(value: Dayjs | null) => {
              setValue(fieldName, value);
              field.onChange(value);

              if (params?.handlers?.[`${fieldName}_value_onchange`]) {
                params?.handlers[`${fieldName}_value_onchange`](value);
              }
            }}
            ampm={ampm}
            disablePast={disablePast}
            disableFuture={disableFuture}
            slotProps={{
              textField: {
                required: !!config?.required,
                error: !!errors[fieldName],
                helperText: errors[fieldName]?.message.toString() || '',
              },
            }}
          />
        )}
      />
    </>
  );
};

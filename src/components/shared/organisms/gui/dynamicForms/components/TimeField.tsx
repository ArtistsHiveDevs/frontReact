import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, FieldErrors, FieldValues, UseFormRegister, useForm, useFormContext } from 'react-hook-form';
import { DynamicFieldData } from '../dynamic-control-types';

export const createTimeField = (params: {
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers?: { [handlerName: string]: Function };
}) => {
  const { label, fieldName, config = {}, componentParams = {}, handlersNames = {} } = params?.fieldData || {};
  const { disablePast, disableFuture } = componentParams || {};

  const defaultTimeValue = config?.value ? dayjs(config.value, 'HH:mm') : null;

  const { control } = useForm({
    defaultValues: {
      [fieldName]: defaultTimeValue,
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
              config.value = value?.format('HH:mm');
              if (register) {
                register(fieldName, config);
              }
              field.onChange(value);

              if (params?.handlers?.[`${fieldName}_value_onchange`]) {
                params?.handlers[`${fieldName}_value_onchange`](value);
              }
            }}
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

import { FormControl, FormControlLabel, FormHelperText, Switch } from '@mui/material';
import { Controller, FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createSwitch = (
  params: ComponentGeneratorParams & {
    formContext?: UseFormReturn<FieldValues>;
  }
) => {
  const { errors, fieldData, handlers, formContext } = params;
  const { label, fieldName, config, componentParams = {} } = fieldData;

  // ✅ Patrón híbrido: usar formContext pasado o fallback a hook
  const hookContext = useFormContext();
  const { control } = formContext || hookContext;

  const { required, disabled } = config || {};

  // Extraer parámetros específicos del componente
  const {
    labelPlacement = 'start', // 'start' | 'end' | 'top' | 'bottom'
    color = 'primary', // 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    size = 'medium', // 'small' | 'medium'
    ...otherParams
  } = componentParams;

  const error = errors?.[fieldName];
  const hasError = !!error;

  const isDisabled = disabled === true || String(disabled) === 'true';

  return (
    <FormControl error={hasError} component="fieldset" disabled={isDisabled}>
      <Controller
        name={fieldName}
        control={control}
        defaultValue={false}
        rules={{
          required: required === true || required === 'true' ? 'Este campo es requerido' : false,
        }}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                {...field}
                checked={field.value || false}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  if (handlers[`on${fieldName}Change`]) {
                    handlers[`on${fieldName}Change`](e.target.checked);
                  }
                }}
                color={color}
                size={size}
                {...otherParams}
              />
            }
            label={label}
            labelPlacement={labelPlacement}
            sx={{ marginLeft: 0 }}
          />
        )}
      />
      {hasError && <FormHelperText error>{error?.message || 'Campo inválido'}</FormHelperText>}
    </FormControl>
  );
};

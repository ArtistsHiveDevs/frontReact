import { FormLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createTextArea = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register, formContext: externalContext } = params || {};

  // ✅ Patrón híbrido: usar formContext pasado O fallback a useFormContext()
  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { trigger, clearErrors } = finalContext || {};

  const { label, fieldName, options = [], config } = fieldData;

  const { required } = config || {};

  const [currentValue, setCurrentValue] = useState(fieldData?.defaultValue || '');

  useEffect(() => {
    const defaultVal = fieldData?.defaultValue || '';
    setCurrentValue(defaultVal);
    if (config) {
      config.value = defaultVal;
    }
  }, [fieldData?.defaultValue, config]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCurrentValue(newValue);
    if (config) {
      config.value = newValue;
    }

    // Limpiar error cuando el usuario empieza a escribir
    if (clearErrors && errors && errors[fieldName]) {
      clearErrors(fieldName);
    }

    // Triggear validación después de un pequeño delay para evitar validar cada tecla
    if (trigger && errors && errors[fieldName]) {
      setTimeout(() => {
        trigger(fieldName);
      }, 300);
    }
  };

  return (
    <>
      <TextField
        {...(register ? register(fieldName, config) : {})}
        multiline
        fullWidth
        minRows={4}
        maxRows={10}
        label={
          <FormLabel
            required={required === true || required === 'true'}
            error={!!(errors && Object.keys(errors).find((key) => key === fieldName))}
          >
            {label}
          </FormLabel>
        }
        value={currentValue}
        onChange={handleChange}
        error={!!(errors && errors[fieldName])}
        helperText={errors && errors[fieldName]?.message?.toString()}
      />
    </>
  );
};

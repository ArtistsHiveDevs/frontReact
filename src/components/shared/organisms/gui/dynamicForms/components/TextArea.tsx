import { FormLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createTextArea = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register, formContext: externalContext } = params || {};

  // ✅ Patrón híbrido: usar formContext pasado O fallback a useFormContext()
  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { trigger, clearErrors, watch, setValue } = finalContext || {};

  const { label, fieldName, options = [], config, componentParams = {}, placeholder = '' } = fieldData;

  const required = !!config?.required;

  // Usar el valor del formulario en lugar de estado local
  const formValue = watch ? watch(fieldName) : undefined;
  const defaultVal = fieldData?.defaultValue || '';
  const [currentValue, setCurrentValue] = useState(formValue ?? defaultVal);

  // Sincronizar con el valor del formulario cuando cambie
  useEffect(() => {
    if (formValue !== undefined && formValue !== currentValue) {
      setCurrentValue(formValue);
    }
  }, [formValue]);

  // Solo actualizar si defaultValue cambia Y el campo está vacío
  useEffect(() => {
    const newDefault = fieldData?.defaultValue || '';
    if (newDefault && !currentValue) {
      setCurrentValue(newDefault);
      if (setValue) {
        setValue(fieldName, newDefault);
      }
      if (config) {
        config.value = newDefault;
      }
    }
  }, [fieldData?.defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCurrentValue(newValue);

    // Actualizar react-hook-form
    if (setValue) {
      setValue(fieldName, newValue, { shouldDirty: true });
    }

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
      {label && (
        <FormLabel
          required={required}
          error={!!(errors && Object.keys(errors).find((key) => key === fieldName))}
          sx={{ mb: 0.5, display: 'block', color: '#fff' }}
        >
          {label}
        </FormLabel>
      )}
      <TextField
        {...(register ? register(fieldName, config) : {})}
        multiline
        placeholder={placeholder}
        fullWidth
        minRows={4}
        maxRows={10}
        value={currentValue}
        onChange={handleChange}
        error={!!(errors && errors[fieldName])}
        helperText={errors && errors[fieldName]?.message?.toString()}
      />
    </>
  );
};

import { FormLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createTextArea = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register } = params || {};

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
  };

  return (
    <>
      <TextField
        {...register(fieldName, config)}
        multiline
        fullWidth
        minRows={4}
        maxRows={10}
        label={
          <FormLabel
            required={required === true || required === 'true'}
            error={!!Object.keys(errors || {}).find((key) => key === fieldName)}
          >
            {label}
          </FormLabel>
        }
        value={currentValue}
        onChange={handleChange}
      />
    </>
  );
};

import { FormControl } from '@mui/base';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createRadio = (params: ComponentGeneratorParams) => {
  const { errors, register, fieldData } = params;
  const { label, fieldName, options = [], config } = fieldData;

  const { required } = config || {};

  return (
    <>
      <FormControl>
        <FormLabel
          required={required === true || required === 'true'}
          error={!!Object.keys(errors || {}).find((key) => key === fieldName)}
        >
          {label}
        </FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue={undefined} name={fieldName}>
          {options.map((option, index) => (
            <FormControlLabel
              key={`${fieldName}-${option.value}`}
              value={option.value}
              control={<Radio {...register(fieldName, config)} />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );
};

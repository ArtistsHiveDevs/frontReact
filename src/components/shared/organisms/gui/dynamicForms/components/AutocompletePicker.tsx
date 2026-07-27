import { Autocomplete, Chip, FormLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';
import { DynamicFieldData, SelectOption } from '../dynamic-control-types';

export const createAutocompletePicker = (params: ComponentGeneratorParams) => {
  const { fieldData } = params;
  let { componentParams, config, fieldName, options } = fieldData as DynamicFieldData;
  options = options || [];
  config = config || {};

  const hookContext = useFormContext();
  const finalContext = params.formContext || hookContext;
  const { register, formState } = finalContext;
  const { errors } = formState || {};

  const [selectedOptions, updateSelectedOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const defaultSelectedOptions = (options || []).filter((option) => option.selected);
    updateSelectedOptions(defaultSelectedOptions);
  }, [options]);

  const hideLabel = componentParams?.hideLabel;

  const handleChange = (_event: React.SyntheticEvent, newValue: SelectOption[]) => {
    updateSelectedOptions(newValue);
    config.value = newValue.map((option) => option.value);
    register(fieldName, config);
  };

  config.value = selectedOptions.map((option) => option.value);
  register(fieldName, config);

  return (
    <>
      {!hideLabel && (
        <FormLabel
          style={{ wordBreak: 'break-word', wordWrap: 'break-word' }}
          error={!!errors[fieldName]}
          required={!!config.required}
        >
          {fieldData.label}
        </FormLabel>
      )}
      <Autocomplete
        multiple
        options={options}
        value={selectedOptions}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => option.label}
        onChange={handleChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <Chip variant="outlined" color="primary" label={option.label} key={key} {...tagProps} />;
          })
        }
        renderInput={(inputParams) => (
          <TextField
            {...inputParams}
            placeholder={fieldData.placeholder}
            error={!!errors[fieldName]}
            required={!!config.required}
          />
        )}
      />
    </>
  );
};

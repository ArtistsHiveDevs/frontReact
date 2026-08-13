import { Autocomplete, Chip, FormLabel, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';
import { DynamicFieldData, SelectOption } from '../dynamic-control-types';

export const createAutocompletePicker = (params: ComponentGeneratorParams) => {
  const { fieldData } = params;
  let { componentParams, config, fieldName, options, defaultValue } = fieldData as DynamicFieldData;
  options = options || [];
  config = config || {};

  const hookContext = useFormContext();
  const finalContext = params.formContext || hookContext;
  const { register, formState, setValue } = finalContext;
  const { errors } = formState || {};

  const [selectedOptions, updateSelectedOptions] = useState<SelectOption[]>([]);

  // Sembramos la selección inicial una sola vez, porque options/defaultValue cambian de referencia en cada render y resetearían los clicks del usuario.
  const hasSeededSelectionRef = useRef(false);
  useEffect(() => {
    if (hasSeededSelectionRef.current || !options?.length || defaultValue === undefined) {
      return;
    }
    hasSeededSelectionRef.current = true;

    const selectedFromOptionsFlag = (options || []).filter((option) => option.selected);
    if (selectedFromOptionsFlag.length > 0) {
      updateSelectedOptions(selectedFromOptionsFlag);
      return;
    }

    const savedValues = Array.isArray(defaultValue) ? defaultValue : [];
    if (savedValues.length === 0) {
      updateSelectedOptions([]);
      return;
    }

    const savedValueIds = savedValues.map((item: any) => (typeof item === 'string' ? item : item?.id ?? item?._id));
    updateSelectedOptions((options || []).filter((option) => savedValueIds.includes(option.value)));
  }, [options, defaultValue]);

  const hideLabel = componentParams?.hideLabel;

  const handleChange = (_event: React.SyntheticEvent, newValue: SelectOption[]) => {
    updateSelectedOptions(newValue);
    const values = newValue.map((option) => option.value);
    config.value = values;
    register(fieldName, config);
    setValue?.(fieldName, values, { shouldDirty: true, shouldValidate: true });
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

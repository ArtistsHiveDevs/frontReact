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
  const { register, setValue, formState } = finalContext;
  const { errors } = formState || {};

  const [selectedOptions, updateSelectedOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const bySelectedFlag = (options || []).filter((option) => option.selected);
    if (bySelectedFlag?.length) {
      updateSelectedOptions(bySelectedFlag);
      return;
    }

    // Algunas entidades (ej. spoken_languages de User) traen el valor actual como códigos/ids crudos
    // en vez de opciones pre-marcadas con `.selected` — hay que resolverlos contra el catálogo cargado.
    const defaultValue = fieldData.defaultValue;
    if (Array.isArray(defaultValue) && defaultValue.length && options?.length) {
      const defaultKeys = new Set(
        defaultValue.map((item: any) =>
          item && typeof item === 'object' ? item.value ?? item.id ?? item._id ?? item.key : item
        )
      );
      updateSelectedOptions(options.filter((option) => defaultKeys.has(option.value)));
      return;
    }

    updateSelectedOptions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, fieldData.defaultValue]);

  const hideLabel = componentParams?.hideLabel;

  const handleChange = (_event: React.SyntheticEvent, newValue: SelectOption[]) => {
    updateSelectedOptions(newValue);
    setValue(
      fieldName,
      newValue.map((option) => option.value),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  // Solo registra las reglas de validación; el valor lo actualiza setValue en handleChange para que react-hook-form marque el campo como dirty.
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
            helperText={errors[fieldName]?.message as string}
            required={!!config.required}
          />
        )}
      />
    </>
  );
};

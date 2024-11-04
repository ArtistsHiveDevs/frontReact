import { FormLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { ComponentGeneratorParams } from '../DynamicControl';

interface OptionType {
  value: string;
  label: string;
}

export const createSelect = (params: ComponentGeneratorParams) => {
  const { register, formState } = useFormContext();
  const { fieldData, errors, handlers } = params;
  const {
    label,
    fieldName,
    defaultValue,
    placeholder = '',
    options = [],
    config = {},
    componentParams = {},
  } = fieldData;

  const { required } = config || {};

  const { control, setValue } = useFormContext();

  const darkTheme = useTheme();

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: darkTheme.palette.background.paper,
      borderColor: darkTheme.palette.divider,
      color: darkTheme.palette.text.primary,
    }),
    menu: (styles: any) => ({
      ...styles,
      backgroundColor: darkTheme.palette.background.paper,
    }),
    singleValue: (styles: any) => ({
      ...styles,
      color: darkTheme.palette.text.primary,
    }),
    option: (styles: any, param: { isFocused: any; isSelected: any }) => ({
      ...styles,
      backgroundColor: param.isSelected
        ? darkTheme.palette.primary.main
        : param.isFocused
        ? darkTheme.palette.action.hover
        : darkTheme.palette.background.paper,
      color: param.isSelected ? darkTheme.palette.primary.contrastText : darkTheme.palette.text.primary,
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: darkTheme.palette.text.secondary,
    }),
  };

  const dispatchHandler = (data: { value: string; label?: string }) => {
    if (data && Object.keys(handlers).indexOf(`onChange${fieldName}`) >= 0) {
      handlers[`onChange${fieldName}`](data);
    }
  };

  const handleChange = (data: any) => {
    setValue(fieldName, data?.value || '');
    dispatchHandler(data);
  };

  useEffect(() => {
    if (defaultValue) {
      handleChange({ value: defaultValue });
    }
  }, [defaultValue, options]);

  let {
    field: { value: langValue, onChange: langOnChange, ref, ...restSelectField },
  } = useController({ name: fieldName, control });

  // Asegurar que el valor inicial sea `undefined` si no hay un valor predeterminado
  if (!langValue && !defaultValue) {
    langValue = undefined;
  }

  return (
    <div>
      <FormLabel
        required={required === true || required === 'true'}
        error={!!Object.keys(errors || {}).find((key) => key === fieldName)}
      >
        {label}
      </FormLabel>
      <Select
        ref={ref}
        className="select-input"
        name={fieldName}
        placeholder={placeholder}
        options={options}
        value={langValue ? options.find((x) => x.value === langValue) : undefined}
        key={`select_${fieldName}`}
        onChange={(option) => {
          langOnChange(option ? option.value : '');
          handleChange(option);
        }}
        {...restSelectField}
        menuPortalTarget={document.body}
        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 9 }) }}
      />
    </div>
  );
};

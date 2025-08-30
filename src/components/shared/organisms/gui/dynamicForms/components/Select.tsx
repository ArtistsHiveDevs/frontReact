import { FormLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { ComponentGeneratorParams } from '../DynamicControl';

interface OptionType {
  value: string;
  label: string;
}

export const createSelect = (params: ComponentGeneratorParams) => {
  const { formState, register } = useFormContext();
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

  const handleChange = (data?: any) => {
    const newValue = data?.value || null;
    config.value = newValue;
    register(fieldName, config);
    setSelectedValue(newValue);
    setValue(fieldName, newValue);
    // Trigger form validation for this field
    dispatchHandler(data);
  };

  let {
    field: { value: selectedValue = null, onChange: setSelectedValue, ref, ...restSelectField },
  } = useController({
    name: fieldName,
    control,
    defaultValue: defaultValue ?? null,
  });

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
        placeholder={placeholder || 'Selecciona una opción'}
        options={options}
        value={selectedValue ? options.find((x: any) => x.value === selectedValue) : null}
        key={`select_${fieldName}`}
        onChange={(option) => {
          handleChange(option || { value: null });
        }}
        {...restSelectField}
        menuPortalTarget={document.body}
        styles={{
          ...customStyles,
          menuPortal: (base) => ({ ...base, zIndex: 3500 }),
        }}
      />
    </div>
  );
};

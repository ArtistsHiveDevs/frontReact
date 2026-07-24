import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { FormLabel, IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { GMapsSvgMaker } from '~/common/utils/object-utils/object-utils-index';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import MapContainer from '~/components/shared/mapPrinter/mapContainer';
import { SocialNetworks } from '~/constants/social-networks.const';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createTextField = (params: ComponentGeneratorParams) => {
  const { fieldData, handlers, formContext: externalContext } = params || {};

  // ✅ Patrón híbrido: usar formContext pasado O fallback a useFormContext()
  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { register, formState, trigger, clearErrors, watch, setValue } = finalContext || {};
  const { errors } = formState || {};
  const [isPasswordType] = useState(fieldData.inputType === 'password');

  const {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = '',
    options = [],
    config = {},
    componentParams = {},
    focused = false,
  } = fieldData;

  // Usar el valor del formulario en lugar de estado local
  const formValue = watch ? watch(fieldName) : undefined;
  const [currentValue, setCurrentValue] = useState(formValue ?? defaultValue ?? '');

  // Sincronizar con el valor del formulario cuando cambie
  useEffect(() => {
    if (formValue !== undefined && formValue !== currentValue) {
      setCurrentValue(formValue);
    }
  }, [formValue]);

  // Solo actualizar si defaultValue cambia Y el campo está vacío
  useEffect(() => {
    if (defaultValue !== undefined && !currentValue) {
      setCurrentValue(defaultValue);
      if (setValue) {
        setValue(fieldName, defaultValue);
      }
    }
  }, [defaultValue]);

  if (isPasswordType) {
    const [showPassword, setShowPassword] = useState(false);

    if (!fieldData.componentParams) {
      fieldData.componentParams = {};
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    fieldData.componentParams.endAdornment = (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
        </IconButton>
      </InputAdornment>
    );
    fieldData.inputType = showPassword ? 'text' : 'password';
  }

  let startAdornment = undefined;
  if (componentParams?.startAdornment) {
    startAdornment = <InputAdornment position="start">{componentParams?.startAdornment}</InputAdornment>;
  }
  const inputProps: {
    inputProps: { max?: number; min?: number };
    startAdornment?: any;
    endAdornment?: any;
  } = {
    inputProps: {},
    startAdornment,
    endAdornment: componentParams?.endAdornment,
  };

  if (inputType === 'number') {
    if (!!config?.min) {
      if (typeof config.min === 'number') {
        inputProps.inputProps.min = config.min;
      } else {
        inputProps.inputProps.min = (config.min as any).value;
      }
    }
    if (!!config?.max) {
      if (typeof config.max === 'number') {
        inputProps.inputProps.max = config.max;
      } else {
        inputProps.inputProps.max = (config.max as any).value;
      }
    }
    config.valueAsNumber = true;
    if (config.value) {
      config.value = Number(config.value);
    }
  }

  const emptyFunction = (data: any) => {
    // console.log("BLUR ", fieldName, data);
  };
  const onBlurHandler = (handlers && handlers['onBlur']) || emptyFunction;
  const variant = componentParams?.variant || 'outlined';

  const required = !!config.required;
  config.value = currentValue;
  if (inputType === 'number') {
    if (config.value) {
      config.value = Number(config.value);
    }
  }
  // console.log("¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿   ¿¿¿¿     ", fieldName, defaultValue);
  return (
    <>
    {label && (
      <FormLabel
        required={required}
        error={!!(errors && errors[fieldName])}
        sx={{ mb: 0.5, display: 'block', color: '#fff' }}
      >
        {label}
      </FormLabel>
    )}
    <TextField
      required={required}
      type={inputType}
      {...(register ? register(fieldName, config) : {})}
      value={currentValue ?? ''}
      placeholder={placeholder}
      error={!!(errors && errors[fieldName])}
      helperText={errors && errors[fieldName]?.message?.toString()}
      InputProps={inputProps}
      onBlur={(data) => {
        onBlurHandler(data);
      }}
      onChange={(data) => {
        const newValue = data.target.value;
        setCurrentValue(newValue);

        // Actualizar react-hook-form
        if (setValue) {
          setValue(fieldName, newValue, {
            shouldDirty: true,
            shouldValidate: true, // Disparar validación en cada cambio
          });
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

        if (handlers && handlers[`on${fieldName}Change`]) {
          handlers[`on${fieldName}Change`](newValue);
        }
      }}
      focused={focused}
      variant={variant}
      fullWidth
    />
    </>
  );
};

export const createSocialNetworkTextField = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register, formContext } = params || {};
  fieldData.inputType = 'text';
  const socialNetwork = SocialNetworks[fieldData.fieldName];

  fieldData.label = socialNetwork.title;

  // ------------ ICON ---------------------
  if (!fieldData.componentParams) {
    fieldData.componentParams = {};
  }

  fieldData.componentParams.startAdornment = socialNetwork.icon && (
    <InputAdornment position="start">
      <DynamicIcons iconName={socialNetwork.icon} size={20} /> {socialNetwork.user_prefix}
    </InputAdornment>
  );

  // -------------- VALIDATION -------------
  let wrongPatternErrorMessage = `${socialNetwork.title} user pattern is wrong`;
  if (fieldData.fieldName === 'email') {
    wrongPatternErrorMessage = 'email is not valid';
  }
  const pattern = {
    pattern: {
      value: socialNetwork.usernamePattern, // /^[A-Za-z](?<=^|[^\/])([A-Za-z0-9_.]{2,24})$/,
      message: wrongPatternErrorMessage,
    },
  };

  if (!fieldData.config) {
    fieldData.config = {};
  }
  fieldData.config = {
    ...pattern,
    required: fieldData?.config?.required,
    maxLength: fieldData?.config?.maxLength,
    minLength: fieldData?.config?.minLength,
  };

  return createTextField({ register, fieldData, errors, formContext });
};

export const createAddressTextField = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register, formContext } = params || {};

  const lat = 4.6126;
  const lng = -74.0705;

  const mapData = {
    zoom: 19,
    center: {
      lat,
      lng,
    },
    marksLocation: [
      {
        position: { lat, lng },
        iconData: GMapsSvgMaker(faMicrophoneLines.icon, {
          color: 'rgb(94, 90, 90)',
          scale: 0.07,
        }),
      },
    ],
    anotherOpts: {},
  };

  const mapContainerStyles = {
    width: '100%',
    height: '400px',
  };

  return (
    <div>
      {createTextField({ register, fieldData, errors, formContext })}
      <MapContainer
        //   key={`section-${section.name}-${index}-${componentIndex}`}
        apiKey={import.meta.env.VITE_GMAPS_KEY}
        stylesc={mapContainerStyles}
        mapData={mapData}
      />
    </div>
  );
};

// ===========================================================================================================
// import React, { useEffect, useState } from 'react';
// import { IconButton, InputAdornment, TextField } from '@mui/material';
// import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

// export const createTextField = ({ register, fieldData, errors }: ComponentGeneratorParams) => {
//   const { label, inputType, fieldName, defaultValue, placeholder = '', config = {}, componentParams = {}, focused = false } = fieldData;

//   // State para manejar el valor actual del input
//   const [currentValue, setCurrentValue] = useState(defaultValue || '');

//   // Manejar cambios en defaultValue usando useEffect
//   useEffect(() => {
//     setCurrentValue(defaultValue || '');
//   }, [defaultValue]);

//   // Manejar visibilidad de contraseña si es inputType === 'password'
//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

//   // Configurar adornos del input
//   const inputProps = {
//     startAdornment: componentParams?.startAdornment,
//     endAdornment: componentParams?.endAdornment || (
//       inputType === 'password' && (
//         <InputAdornment position="end">
//           <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="end">
//             {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
//           </IconButton>
//         </InputAdornment>
//       )
//     ),
//   };

//   // Configurar props del TextField
//   const textFieldProps = {
//     required: !!config.required,
//     label: label || '',
//     type: showPassword ? 'text' : inputType,
//     ...register(fieldName, config), // Registrar con react-hook-form
//     value: currentValue,
//     placeholder,
//     error: !!errors[fieldName],
//     helperText: errors[fieldName]?.message?.toString(),
//     InputProps: inputProps,
//     onBlur: () => {}, // Función de onBlur
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentValue(e.target.value), // Manejar cambio de valor
//     focused,
//     variant: componentParams?.variant || 'outlined',
//     fullWidth: true,
//   };

//   return <TextField {...textFieldProps} />;
// };

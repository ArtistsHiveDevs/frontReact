import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { GMapsSvgMaker } from '~/common/utils/object-utils/object-utils-index';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import MapContainer from '~/components/shared/mapPrinter/mapContainer';
import { SocialNetworks } from '~/constants/social-networks.const';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createTextField = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register, handlers } = params || {};
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

  useEffect(() => {
    setCurrentValue(fieldData?.defaultValue);
  }, [fieldData]);
  const [currentValue, setCurrentValue] = useState(defaultValue);

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

  const inputProps: {
    inputProps: { max?: number; min?: number };
    startAdornment?: any;
    endAdornment?: any;
  } = {
    inputProps: {},
    startAdornment: componentParams?.startAdornment,
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
  }

  const emptyFunction = (data: any) => {
    // console.log("BLUR ", fieldName, data);
  };
  const onBlurHandler = (handlers && handlers['onBlur']) || emptyFunction;
  const variant = componentParams?.variant || 'outlined';

  const { required } = config || {};
  config.value = currentValue;

  // console.log("¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿   ¿¿¿¿     ", fieldName, defaultValue);
  return (
    <TextField
      required={required === true || required === 'true'}
      label={label}
      type={inputType}
      {...register(fieldName, config)}
      value={currentValue}
      placeholder={placeholder}
      error={!!errors[fieldName]}
      helperText={errors[fieldName]?.message?.toString()}
      InputProps={inputProps}
      onBlur={(data) => {
        onBlurHandler(data);
      }}
      onChange={(data) => setCurrentValue(data.target.value)}
      focused={focused}
      variant={variant}
      fullWidth
    />
  );
};

export const createSocialNetworkTextField = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register } = params || {};
  fieldData.inputType = 'text';
  const socialNetwork = SocialNetworks[fieldData.fieldName];

  fieldData.label = socialNetwork.title;

  // ------------ ICON ---------------------
  if (!fieldData.componentParams) {
    fieldData.componentParams = {};
  }

  fieldData.componentParams.startAdornment = socialNetwork.icon && (
    <InputAdornment position="start">
      <DynamicIcons iconName={socialNetwork.icon} size={20} color="#7a260a" /> {socialNetwork.user_prefix}
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

  return createTextField({ register, fieldData, errors });
};

export const createAddressTextField = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register } = params || {};

  const googleApiKey = 'AIzaSyBzyzf0hnuMJBdOB9sR0kBbBTtqYs-XECs';

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
      {createTextField({ register, fieldData, errors })}
      <MapContainer
        //   key={`section-${section.name}-${index}-${componentIndex}`}
        apiKey={googleApiKey}
        stylesc={mapContainerStyles}
        mapData={mapData}
      />
    </div>
  );
};

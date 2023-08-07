import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import DynamicIcons from "~/components/shared/DynamicIcons";
import { SocialNetworks } from "~/constants/social-networks.const";
import { DynamicFieldData } from "../dynamic-control-types";

export const createTextField = (
  register: UseFormRegister<FieldValues>,
  fieldData: DynamicFieldData,
  errors: FieldErrors<FieldValues>
) => {
  const [isPasswordType] = useState(fieldData.inputType === "password");

  const {
    label,
    inputType,
    fieldName,
    defaultValue,
    placeholder = "",
    options = [],
    config = {},
    componentParams = {},
  } = fieldData;

  if (isPasswordType) {
    const [showPassword, setShowPassword] = useState(false);

    if (!fieldData.componentParams) {
      fieldData.componentParams = {};
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
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
    fieldData.inputType = showPassword ? "text" : "password";
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

  if (inputType === "number") {
    if (!!config?.min) {
      if (typeof config.min === "number") {
        inputProps.inputProps.min = config.min;
      } else {
        inputProps.inputProps.min = config.min.value;
      }
    }
    if (!!config?.max) {
      if (typeof config.max === "number") {
        inputProps.inputProps.max = config.max;
      } else {
        inputProps.inputProps.max = config.max.value;
      }
    }
  }

  return (
    <TextField
      label={label}
      type={inputType}
      {...register(fieldName, config)}
      defaultValue={defaultValue}
      placeholder={placeholder}
      error={!!errors[fieldName]}
      helperText={errors[fieldName]?.message?.toString()}
      InputProps={inputProps}
      fullWidth
    />
  );
};

export const createSocialNetworkTextField = (
  register: UseFormRegister<FieldValues>,
  fieldData: DynamicFieldData,
  errors: FieldErrors<FieldValues>
) => {
  fieldData.inputType = "text";
  const socialNetwork = SocialNetworks[fieldData.fieldName];

  fieldData.label = socialNetwork.title;

  // ------------ ICON ---------------------
  if (!fieldData.componentParams) {
    fieldData.componentParams = {};
  }

  fieldData.componentParams.startAdornment = (
    <InputAdornment position="start">
      <DynamicIcons iconName={socialNetwork.icon} size={20} color="#7a260a" />{" "}
      {socialNetwork.user_prefix}
    </InputAdornment>
  );

  // -------------- VALIDATION -------------
  const pattern = {
    pattern: {
      value:
        socialNetwork.usernamePattern ||
        /^[A-Za-z](?<=^|[^\/])([A-Za-z0-9_.]{2,24})$/,
      message: "MAl usuario",
    },
  };

  if (!fieldData.config) {
    fieldData.config = {};
  }
  fieldData.config = { ...pattern };

  return createTextField(register, fieldData, errors);
};

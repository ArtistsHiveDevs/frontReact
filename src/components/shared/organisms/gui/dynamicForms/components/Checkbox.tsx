import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ComponentGeneratorParams } from "../DynamicControl";

export const createCheckbox = (params: ComponentGeneratorParams) => {
  const [mainFieldChecked, setMainFieldChecked] = useState(false);
  const [optionsChecked, setOptionsChecked] = useState([]);

  const [mainFieldAllSame, setMainFieldAllSame] = useState(false);

  const { errors, register, watch, fieldData } = params;
  const { label, fieldName, options = [], config, componentParams } = fieldData;

  const required = config?.required || false;
  const { labelAsCheck } = componentParams || {};

  const values = options.map((option) => option.value);
  useEffect(() => {
    setOptionsChecked(new Array(values.length).fill(false));
  }, []);

  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) => {
  //     // const optionsValues = Object.keys(value).filter((option) =>
  //     //   values.find((optionV) => optionV === option)
  //     // );

  //     const allChecked = optionsChecked.every((optionValue) => !!optionValue);

  //     // setMainFieldChecked(allChecked);

  //     const allSame = optionsChecked.every(
  //       (optionValue, index, array) => optionValue === array[0]
  //     );

  //     setMainFieldAllSame(allSame);
  //     console.log(
  //       "###  ",
  //       // optionsValues.map((key) => `${key} - ${value[key]}`),
  //       "ALL [",
  //       allChecked,
  //       mainFieldChecked,
  //       "ALL-same",
  //       allSame,
  //       mainFieldAllSame
  //     );
  //     console.log(
  //       "*******************    ",
  //       mainFieldChecked,
  //       mainFieldAllSame
  //     );
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const mainFieldChanged = (event: any, checked: boolean) => {
    setMainFieldChecked(checked);
    setOptionsChecked(new Array(values.length).fill(checked));
    console.log(checked, optionsChecked);
  };

  const optionsChanged = (index: number, event: any, checked: boolean) => {
    const newOptions = [...optionsChecked];
    newOptions[index] = !newOptions[index];
    setOptionsChecked(newOptions);
  };

  config.setValueAs = (value: string | null): boolean | null => {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    } else if (value === null) {
      // Sometimes the radio group can be optional, allow this case
      return null;
    } else {
      throw new Error(
        `this radio group is supposed to only manage string boolean values ("true", "false"), or can optionally be null.`
      );
    }
  };

  return (
    <>
      <FormGroup>
        {!!label && (
          <>
            {!required && options.length > 0 && (
              <FormLabel
                required={required === true || required === "true"}
                error={
                  !!Object.keys(errors || {}).find((key) => key === fieldName)
                }
              >
                {label}
              </FormLabel>
            )}
            {(required || labelAsCheck) && (
              <FormControlLabel
                // error={
                //   !!Object.keys(errors || {}).find((key) => key === fieldName)
                //     ? "true"
                //     : undefined
                // }

                control={
                  <Checkbox
                    {...register(fieldName, config)}
                    // checked={mainFieldChecked}
                    // checked={mainFieldChecked}
                    indeterminate={
                      !required && !mainFieldChecked && !mainFieldAllSame
                    }
                    // value={mainFieldChecked}
                    // onChange={mainFieldChanged}
                  />
                }
                label={
                  <FormLabel
                    required={required === true || required === "true"}
                    error={
                      !!Object.keys(errors || {}).find(
                        (key) => key === fieldName
                      )
                    }
                  >
                    {label}
                  </FormLabel>
                }
              />
            )}
          </>
        )}
        {!!options && !!options.length && (
          <div style={labelAsCheck ? { paddingLeft: "1rem" } : {}}>
            {options.map((option, index) => {
              return (
                <FormControlLabel
                  key={`${fieldName}-check-${index}`}
                  control={<Checkbox {...register(option.value, config)} />}
                  label={
                    <FormLabel
                      required={required === true || required === "true"}
                      error={
                        !!Object.keys(errors || {}).find(
                          (key) => key === option.value
                        )
                      }
                    >
                      {option.label}
                    </FormLabel>
                  }
                />
              );
            })}
          </div>
        )}
      </FormGroup>
    </>
  );
};

import { FormLabel, TextField } from "@mui/material";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ComponentGeneratorParams } from "../DynamicControl";

export const createTextArea = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register } = params || {};

  const { label, fieldName, options = [], config } = fieldData;

  const { required } = config || {};

  return (
    <>
      <TextField
        {...register(fieldName, config)}
        multiline
        fullWidth
        minRows={4}
        maxRows={10}
        label={
          <FormLabel
            required={required === true || required === "true"}
            error={!!Object.keys(errors || {}).find((key) => key === fieldName)}
          >
            {label}
          </FormLabel>
        }
      />
    </>
  );
};

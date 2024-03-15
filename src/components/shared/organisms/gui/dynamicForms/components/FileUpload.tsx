import { InputLabel } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useFormContext } from "react-hook-form";
import { useI18n } from "~/common/utils";
import { DynamicIcons } from "~/components/shared/DynamicIcons";
import { ComponentGeneratorParams } from "../DynamicControl";

export const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS =
  "app.global_dictionary.actions";
export const createFileUpload = (params: ComponentGeneratorParams) => {
  const { translateText } = useI18n();

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const { fieldData } = params;
  const { register, formState } = useFormContext();
  const { errors } = formState || {};

  const {
    label,
    fieldName,
    options = [],
    config,
    componentParams,
  } = fieldData || {};

  const { multipleFiles, accept } = componentParams || {};

  return (
    <>
      <InputLabel
        id={`label_${fieldName}`}
        required={!!config?.required}
        error={!!errors[fieldName]}
      >
        {label}
      </InputLabel>

      <Button
        component="label"
        variant="contained"
        startIcon={<DynamicIcons iconName="BsCloudArrowUp" />}
      >
        {translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.upload`)}
        <VisuallyHiddenInput
          type="file"
          {...register(fieldName)}
          multiple={multipleFiles}
          accept={accept}
        />
      </Button>
    </>
  );
};

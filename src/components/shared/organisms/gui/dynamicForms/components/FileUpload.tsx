import { InputLabel } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { DynamicIcons } from "~/components/shared/DynamicIcons";
import { ComponentGeneratorParams } from "../DynamicControl";

export const createFileUpload = (params: ComponentGeneratorParams) => {
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

  const { register, fieldData } = params;

  const {
    label,
    fieldName,
    options = [],
    config,
    componentParams,
  } = fieldData || {};

  const { multipleFiles } = componentParams || {};

  return (
    <>
      <InputLabel id={`label_${fieldName}`}>{label}</InputLabel>

      <Button
        component="label"
        variant="contained"
        startIcon={<DynamicIcons iconName="BsCloudArrowUp" />}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          {...register(fieldName)}
          multiple={multipleFiles}
        />
      </Button>
    </>
  );
};

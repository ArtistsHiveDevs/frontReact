import {
  Backdrop,
  Box,
  Chip,
  Fade,
  FormLabel,
  Modal,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useI18n } from "~/common/utils";
import { ComponentGeneratorParams } from "../DynamicControl";
import { DynamicFieldData } from "../dynamic-control-types";

export const MAX_VISIBLE_ELEMENTS = 15;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxWidth: "92%",
  height: "auto",
  maxHeight: "80%",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  overflow: "auto",
  p: 4,
};

export const createChipPicker = (params: ComponentGeneratorParams) => {
  const { translateText } = useI18n();
  const { fieldData, formContext } = params;
  let { componentParams, config, fieldName, options } =
    fieldData as DynamicFieldData;
  options = options || [];
  config = config || {};
  const { register } = formContext;

  const [selectedOptions, updateSelectedOptions] = useState([]);
  // (options || [])
  //   .filter((option) => option.selected)
  //   .map((option) => option.value)
  const [displayAllOptions, setDisplayAllOptions] = useState(false);

  // useEffect(() => {

  // }, [selectedOptions]);

  const hideLabel = componentParams?.hideLabel;

  const handleClickInChip = (element: any) => {
    let newSelection = [...selectedOptions];
    const exists = selectedOptions.find((value) => value === element.value);
    if (exists) {
      newSelection = newSelection.filter((value) => value !== element.value);
    } else {
      newSelection.push(element.value);
    }
    console.log(selectedOptions, newSelection);
    updateSelectedOptions(newSelection);
    config.value = newSelection || [];
    register(fieldName, config);
  };

  const renderedOptions = options.slice(
    0,
    componentParams?.max_visible || MAX_VISIBLE_ELEMENTS
  );

  const handleClose = (e: any) => {
    setDisplayAllOptions(false);
  };

  // useEffect(() => {
  //   // updateSelectedOptions(
  //   //   options.filter((option) => option.selected).map((option) => option.value)
  //   // );
  // }, [params]);
  config.value = selectedOptions || [];
  register(fieldName, config);

  return (
    <>
      {!hideLabel && (
        <FormLabel style={{ wordBreak: "break-word", wordWrap: "break-word" }}>
          {fieldData.label}
        </FormLabel>
      )}
      <Stack
        direction="row"
        spacing={1}
        sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
      >
        {renderedOptions.map((option, index) => (
          <Chip
            key={`option-${fieldName}-${option.value}`}
            label={option.label}
            color="primary"
            variant={
              selectedOptions.find(
                (selectedValue) => selectedValue === option.value
              )
                ? "filled"
                : "outlined"
            }
            onClick={() => handleClickInChip(option)}
          />
        ))}

        {renderedOptions.length < options.length && (
          <Chip
            label="..."
            variant="outlined"
            onClick={() => setDisplayAllOptions(true)}
          />
        )}
      </Stack>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={displayAllOptions}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Fade in={displayAllOptions}>
            <Box sx={style}>
              <FormLabel
                style={{ wordBreak: "break-word", wordWrap: "break-word" }}
              >
                {fieldData.label}
              </FormLabel>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
              >
                {options.map((option, index) => (
                  <Chip
                    key={`option-${fieldName}-${option.value}`}
                    label={option.label}
                    color="primary"
                    variant={
                      selectedOptions.find(
                        (selectedValue) => selectedValue === option.value
                      )
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() => handleClickInChip(option)}
                  />
                ))}
              </Stack>
            </Box>
          </Fade>
        </div>
      </Modal>
    </>
  );
};

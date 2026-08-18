import { FormControl } from '@mui/base';
import { Box, FormLabel, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ComponentGeneratorParams } from '../DynamicControl';

import Autocomplete from '@mui/material/Autocomplete';
import * as React from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ProfileThumbnailCard } from '~/components/shared/molecules/Profile/ProfileThumbnailCard';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { ResultElement } from '~/components/shared/search/result-element';
import { SearchableProfileTemplate } from '~/models/base';

enum InRangeValidation {
  BELOW_LOWER_LIMIT,
  IN_RANGE,
  ON_UPPER_LIMIT,
}

export const createRelationshipSelector = (params: ComponentGeneratorParams) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const { errors, register, fieldData, handlers } = params;
  const { label, fieldName, config, componentParams } = fieldData;

  const hookContext = useFormContext();
  const { setValue } = params.formContext || hookContext;
  let { options, minimumRelations, maximumRelations, isLoading, defaultSelection } = componentParams || {};

  let initialSelectedValues = Array.isArray(defaultSelection) ? [...defaultSelection] : [];
  if (componentParams && componentParams['relationshipSelectedOptions']) {
    initialSelectedValues = [...initialSelectedValues, ...componentParams['relationshipSelectedOptions']];
  }

  const [selectedValues, setSelectedValues] = React.useState<SearchableProfileTemplate[]>(initialSelectedValues);

  const [openList, setOpenedList] = React.useState<boolean>(false);

  if (!options) {
    options = [];
  }

  if (!minimumRelations) {
    minimumRelations = 1;
  }

  const handleClose = () => {
    setInputValue(undefined);
  };

  const handleInputChange = (event: any) => {
    const searchValue = event?.target?.value;
    setInputValue(searchValue);
    setOpenedList(searchValue?.trim()?.length > 0);

    if (handlers && handlers[`${fieldName}_onChange`]) {
      handlers[`${fieldName}_onChange`](event);
    }
  };

  const { required } = config || {};

  const isInSelectableRange = () => {
    let inRange = InRangeValidation.IN_RANGE;
    if (selectedValues.length < minimumRelations) {
      inRange = InRangeValidation.BELOW_LOWER_LIMIT;
    }
    if (maximumRelations && selectedValues.length >= maximumRelations) {
      inRange = InRangeValidation.ON_UPPER_LIMIT;
    }
    return inRange;
  };

  const deletedSelectedValue = (element: any) => {
    updateSelection(selectedValues.filter((value) => value.id !== element.id));
  };

  const registerValues = (elements: any) => {
    if (setValue) {
      const newValue =
        maximumRelations === 1
          ? elements.length > 0
            ? elements[0].id
            : null
          : elements.map((element: any) => element.id);

      setValue(fieldName, newValue, { shouldDirty: true, shouldValidate: true });
    }
  };
  const updateSelection = (elements: any) => {
    setSelectedValues(elements);
    if (handlers && handlers[`${fieldName}_selection_changed`]) {
      handlers[`${fieldName}_selection_changed`](elements);
    }

    registerValues(elements);
  };

  React.useEffect(() => {
    if (register) {
      register(fieldName, config);
    }
    if (setValue && selectedValues?.length) {
      // Sincroniza el valor inicial sin marcar el campo como dirty (no es un cambio del usuario).
      const initialValue =
        maximumRelations === 1
          ? selectedValues[0].id
          : selectedValues.map((element) => element.id);
      setValue(fieldName, initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormControl>
        <FormLabel
          required={required === true || required === 'true'}
          error={!!Object.keys(errors || {}).find((key) => key === fieldName)}
        >
          {label}
        </FormLabel>

        <Autocomplete
          freeSolo
          loading
          loadingText={<AppLoader />}
          open={openList}
          multiple
          onClose={(event: React.ChangeEvent<{}>, reason) => {
            if (reason === 'escape') {
              handleClose();
            }
            setOpenedList(false);
            setInputValue('');
          }}
          value={selectedValues}
          filterOptions={(x) => x}
          onChange={(event, newValue, reason) => {
            if (
              event.type === 'keydown' &&
              ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') &&
              reason === 'removeOption'
            ) {
              return;
            }
            updateSelection(newValue);
          }}
          clearIcon={false}
          renderTags={() => null}
          noOptionsText="No labels"
          renderOption={(props, option: SearchableProfileTemplate, { selected }) => (
            <li {...props}>
              <ResultElement
                key={`full-${option.name}-${option.id}`}
                element={option}
                elementType={'Artists'}
                onClick={() => {
                  handleClose();
                }}
              />
            </li>
          )}
          inputValue={inputValue}
          options={options}
          getOptionLabel={(option) => (option as SearchableProfileTemplate).id}
          renderInput={(params) =>
            isInSelectableRange() !== InRangeValidation.ON_UPPER_LIMIT && (
              <TextField
                {...params}
                required={required === true || required === 'true'}
                error={!!errors[fieldName]}
                inputProps={params.inputProps}
                placeholder="Filter labels"
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
              />
            )
          }
        ></Autocomplete>

        {/* List of selected elements */}
        <Box>
          {(selectedValues || []).map((selectedValue) => {
            return (
              <ProfileThumbnailCard
                key={`full-${selectedValue.name}-${selectedValue.id}`}
                elementData={selectedValue}
                footer={() => (
                  <div style={{ textAlign: 'right' }}>
                    <div onClick={() => deletedSelectedValue(selectedValue)}>
                      <DynamicIcons iconName="MdDeleteOutline" size={'1.4rem'} />
                    </div>
                  </div>
                )}
              />
            );
          })}
        </Box>
      </FormControl>
    </>
  );
};

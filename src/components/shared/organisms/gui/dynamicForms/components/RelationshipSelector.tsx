import { FormControl } from '@mui/base';
import { Box, FormLabel, TextField } from '@mui/material';
import { ComponentGeneratorParams } from '../DynamicControl';

// import CloseIcon from '@mui/icons-material/Close';
// import DoneIcon from '@mui/icons-material/Done';
// import SettingsIcon from '@mui/icons-material/Settings';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import * as React from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ProfileThumbnailCard } from '~/components/shared/molecules/Profile/ProfileThumbnailCard';
import { ResultElement } from '~/components/shared/search/result-element';
import { SearchableTemplate } from '~/models/base';

//   profile_pic?: string;
//   name: string;
//   subtitle?: string;
//   description?: string;
//   cityWithCountry?: string;
//   country?: string;
//   place?: PlaceModel;
//   verified_status?: VerificationStatus;

enum InRangeValidation {
  BELOW_LOWER_LIMIT,
  IN_RANGE,
  ON_UPPER_LIMIT,
}

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

function PopperComponent(props: PopperComponentProps) {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <div className={autocompleteClasses.paper} {...other} />;
}

export const createRelationShipSelector = (params: ComponentGeneratorParams) => {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const [value, setValue] = React.useState<SearchableTemplate[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [selectedValues, setSelectedValues] = React.useState<SearchableTemplate[]>([]);
  const [openList, setOpenedList] = React.useState<boolean>(false);
  const { errors, register, fieldData, handlers } = params;
  const { label, fieldName, config, componentParams } = fieldData;
  let { options, minimumRelations, maximumRelations } = componentParams || {};
  console.log('PREVIOUS ', config);

  if (!options) {
    options = [];
  }

  if (!minimumRelations) {
    minimumRelations = 1;
  }

  // if (!maximumRelations) {
  //   maximumRelations = 3;
  // }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // setPendingValue(value);
    // setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    // setValue(pendingValue);
    setInputValue(undefined);
    // if (anchorEl) {
    //   anchorEl.focus();
    // }
    // setAnchorEl(null);
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

  // console.log(value);
  // console.log(fieldData);
  // console.log(handlers);

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

  const updateSelection = (elements: any) => {
    setSelectedValues(elements);
    if (register) {
      if (maximumRelations === 1) {
        config.value = elements[0].id;
      } else {
        config.value = elements.map((element: any) => element.id);
      }
      register(fieldName, config);
    }
  };

  console.log('REGISTER', fieldName, config);

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
          open={openList}
          multiple
          onClose={(event: React.ChangeEvent<{}>, reason) => {
            if (reason === 'escape') {
              handleClose();
            }
            setOpenedList(false);
            setInputValue('');
            console.log('CLOSE ', event);
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
          // onBlur={(event) => {
          //   console.log('BLUR ', event);
          // }}
          clearIcon={false}
          // PopperComponent={PopperComponent}
          renderTags={() => null}
          noOptionsText="No labels"
          renderOption={(props, option, { selected }) => (
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
          getOptionLabel={(option) => option.name}
          renderInput={(params) =>
            isInSelectableRange() !== InRangeValidation.ON_UPPER_LIMIT && (
              <TextField
                {...params}
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
        {/* <React.Fragment>
          <Box sx={{ width: 221, fontSize: 13 }}>
            <ButtonBase disableRipple aria-describedby={id} onClick={handleClick}>
              <span>Labels</span>
              <MdSettingsInputComponent />
            </ButtonBase>
            {value.map((label) => (
              <div
                key={label.name}
                style={{
                  marginTop: '3px',
                  height: 20,
                  padding: '.15em 4px',
                  fontWeight: 600,
                  lineHeight: '15px',
                  borderRadius: '2px',
                  backgroundColor: label?.color,
                  color: theme?.palette.getContrastText(label?.color),
                }}
              >
                {label.name}
              </div>
            ))}
          </Box>
          <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
            <ClickAwayListener onClickAway={handleClose}>
              <div>
                <Box
                  sx={{
                    borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
                    padding: '8px 10px',
                    fontWeight: 600,
                  }}
                >
                  Apply labels to this pull request
                </Box>
                <Autocomplete
                  open
                  multiple
                  onClose={(event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
                    if (reason === 'escape') {
                      handleClose();
                    }
                  }}
                  value={pendingValue}
                  onChange={(event, newValue, reason) => {
                    if (
                      event.type === 'keydown' &&
                      ((event as React.KeyboardEvent).key === 'Backspace' ||
                        (event as React.KeyboardEvent).key === 'Delete') &&
                      reason === 'removeOption'
                    ) {
                      return;
                    }
                    setPendingValue(newValue);
                  }}
                  disableCloseOnSelect
                  PopperComponent={PopperComponent}
                  renderTags={() => null}
                  noOptionsText="No labels"
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      DONE
                      {/* <DoneIcon
                        sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                        style={{
                          visibility: selected ? 'visible' : 'hidden',
                        }}
                      /> *}
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          flexShrink: 0,
                          borderRadius: '3px',
                          marginRight: '1px',
                          marginTop: '2px',
                          backgroundColor: option.color,
                        }}
                      />
                      <span
                        style={{
                          flexGrow: 1,
                          color: theme.palette.mode === 'light' ? '#586069' : '#8b949e',
                        }}
                      >
                        {option.name}
                        <br />
                        <span>{option.description}</span>
                      </span>
                      X
                      {/* <CloseIcon
                        sx={{ opacity: 0.6, width: 18, height: 18 }}
                        style={{
                          visibility: selected ? 'visible' : 'hidden',
                        }}
                      /> *}
                    </li>
                  )}
                  options={[...labels].sort((a, b) => {
                    let ai = value.indexOf(a);
                    ai = ai === -1 ? value.length + labels.indexOf(a) : ai;
                    let bi = value.indexOf(b);
                    bi = bi === -1 ? value.length + labels.indexOf(b) : bi;
                    return ai - bi;
                  })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <InputBase
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                      autoFocus
                      placeholder="Filter labels"
                      style={{
                        padding: 10,
                        width: '100%',
                        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
                        // '& input': {
                        //   borderRadius: 4,
                        //   backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
                        //   padding: 8,
                        //   transition: theme.transitions.create(['border-color', 'box-shadow']),
                        //   border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
                        //   fontSize: 14,
                        //   '&:focus': {
                        //     boxShadow: `0px 0px 0px 3px ${
                        //       theme.palette.mode === 'light' ? 'rgba(3, 102, 214, 0.3)' : 'rgb(12, 45, 107)'
                        //     }`,
                        //     borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd',
                        //   },
                        // },
                      }}
                    />
                  )}
                />
              </div>
            </ClickAwayListener>
          </Popper>
        </React.Fragment> */}
      </FormControl>
    </>
  );
};

import { Box, FormLabel, IconButton, InputAdornment, TextField } from '@mui/material';
import { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFormContext } from 'react-hook-form';
import { MdArrowDropDown } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Flag from 'react-world-flags';
import { selectorCountries, useCountriesSlice } from '~/common/slices/parametrics/geo/country.redux';
import { useI18n } from '~/common/utils';
import { DEFAULT_PHONE_PREFIX, parsePhoneValue } from '~/constants/phone-prefixes.const';
import { ComponentGeneratorParams } from '../DynamicControl';

const normalize = (value: string) => value.toLowerCase().trim();

interface PhonePrefixOption {
  iso2: string;
  name: string;
  dialCode: string;
}

export const createPhonePrefixField = (params: ComponentGeneratorParams) => {
  const { fieldData, handlers, formContext: externalContext } = params || {};

  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { register, formState, trigger, clearErrors, watch, setValue } = finalContext || {};
  const { errors } = formState || {};

  const { label, fieldName, defaultValue, config = {}, focused = false } = fieldData;

  const dispatch = useDispatch();
  const { translateText } = useI18n();
  const { actions: countryActions } = useCountriesSlice();
  const availableCountries = useSelector(selectorCountries.selectItems);

  useEffect(() => {
    dispatch(countryActions.loadItems({}));
  }, [dispatch, countryActions]);

  const phonePrefixOptions: PhonePrefixOption[] = useMemo(
    () =>
      availableCountries
        .filter((country) => !!country.phone && !!country.alpha2)
        .map((country) => ({
          iso2: country.alpha2,
          dialCode: `+${country.phone}`,
          name: `${country.name}${country.name !== country.native ? ' (' + country.native + ')' : ''}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [availableCountries]
  );

  const formValue = watch ? watch(fieldName) : undefined;
  const initialParsedValue = parsePhoneValue(formValue ?? defaultValue, [DEFAULT_PHONE_PREFIX]);

  const [dialCode, setDialCode] = useState(initialParsedValue.dialCode);
  const [localNumber, setLocalNumber] = useState(initialParsedValue.number);
  const [isPrefixListOpen, setIsPrefixListOpen] = useState(false);
  const [prefixSearchTerm, setPrefixSearchTerm] = useState('');

  const anchorRowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (register) {
      register(fieldName, config);
    }
  }, [register, fieldName]);

  useEffect(() => {
    if (formValue === undefined && setValue) {
      const seededValue = `${initialParsedValue.dialCode}${initialParsedValue.number}`.trim();
      setValue(fieldName, seededValue, { shouldDirty: false });
    }
  }, [defaultValue]);

  // Re-derive the dial code/number split once the real country dial codes have loaded,
  // since the initial parse above only had DEFAULT_PHONE_PREFIX to match against.
  const initialSyncDoneRef = useRef(false);
  useEffect(() => {
    if (initialSyncDoneRef.current || phonePrefixOptions.length === 0) {
      return;
    }
    initialSyncDoneRef.current = true;
    const parsed = parsePhoneValue(
      formValue ?? defaultValue,
      phonePrefixOptions.map((prefix) => prefix.dialCode)
    );
    setDialCode(parsed.dialCode);
    setLocalNumber(parsed.number);
  }, [phonePrefixOptions]);

  const composeAndSetValue = (nextDialCode: string, nextLocalNumber: string) => {
    const composedValue = `${nextDialCode}${nextLocalNumber}`.trim();

    if (setValue) {
      setValue(fieldName, composedValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (clearErrors && errors && errors[fieldName]) {
      clearErrors(fieldName);
    }

    if (trigger && errors && errors[fieldName]) {
      setTimeout(() => {
        trigger(fieldName);
      }, 300);
    }

    if (handlers && handlers[`on${fieldName}Change`]) {
      handlers[`on${fieldName}Change`](composedValue);
    }
  };

  const handleDialCodeChange = (newDialCode: string) => {
    setDialCode(newDialCode);
    composeAndSetValue(newDialCode, localNumber);
  };

  const handleLocalNumberChange = (newLocalNumber: string) => {
    setLocalNumber(newLocalNumber);
    composeAndSetValue(dialCode, newLocalNumber);
  };

  const required = !!config.required;

  const selectedPrefixOption: PhonePrefixOption =
    phonePrefixOptions.find((prefix) => prefix.dialCode === dialCode) ||
    phonePrefixOptions.find((prefix) => prefix.dialCode === DEFAULT_PHONE_PREFIX) || { iso2: '', name: '', dialCode };

  const filteredPrefixes = useMemo(() => {
    const term = normalize(prefixSearchTerm);
    if (!term) {
      return phonePrefixOptions;
    }
    return phonePrefixOptions.filter(
      (prefix) => normalize(prefix.name).includes(term) || prefix.dialCode.includes(prefixSearchTerm.trim())
    );
  }, [prefixSearchTerm, phonePrefixOptions]);

  const openPrefixList = () => {
    if (anchorRowRef.current) {
      const rect = anchorRowRef.current.getBoundingClientRect();
      setPanelPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setPrefixSearchTerm('');
    setIsPrefixListOpen(true);
  };

  const closePrefixList = () => {
    setIsPrefixListOpen(false);
    setPrefixSearchTerm('');
  };

  useEffect(() => {
    if (!isPrefixListOpen) {
      return;
    }

    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (anchorRowRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      closePrefixList();
    };

    const handleScroll = () => {
      if (!anchorRowRef.current) {
        return;
      }
      const rect = anchorRowRef.current.getBoundingClientRect();
      setPanelPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isPrefixListOpen]);

  const selectPrefix = (prefix: PhonePrefixOption) => {
    handleDialCodeChange(prefix.dialCode);
    closePrefixList();
  };

  const handlePrefixInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      closePrefixList();
      return;
    }
    if (event.key === 'Enter' && filteredPrefixes.length > 0) {
      event.preventDefault();
      selectPrefix(filteredPrefixes[0]);
    }
  };

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
      <Box ref={anchorRowRef} sx={{ display: 'flex' }}>
        <TextField
          value={dialCode}
          onClick={openPrefixList}
          onFocus={openPrefixList}
          inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
          autoComplete="off"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                {selectedPrefixOption.iso2 && <Flag code={selectedPrefixOption.iso2} height="14" />}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ ml: 0 }}>
                <IconButton
                  size="small"
                  tabIndex={-1}
                  sx={{ p: 0.25 }}
                  onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                    if (isPrefixListOpen) {
                      closePrefixList();
                    } else {
                      openPrefixList();
                    }
                  }}
                >
                  <MdArrowDropDown />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: 108,
            cursor: 'pointer',
            '& .MuiOutlinedInput-input': {
              paddingLeft: 0.5,
              paddingRight: 0.5,
              minWidth: 0,
            },
            '& .MuiOutlinedInput-root': {
              paddingRight: 0.5,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
            '& .MuiOutlinedInput-root.Mui-focused': {
              zIndex: 1,
            },
          }}
          variant="outlined"
        />
        <TextField
          required={required}
          type="tel"
          value={localNumber}
          error={!!(errors && errors[fieldName])}
          helperText={errors && errors[fieldName]?.message?.toString()}
          onChange={(event) => handleLocalNumberChange(event.target.value.replace(/\D/g, ''))}
          onFocus={closePrefixList}
          focused={focused}
          variant="outlined"
          fullWidth
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              marginLeft: '-1px',
            },
            '& .MuiOutlinedInput-root.Mui-focused': {
              zIndex: 1,
            },
          }}
        />
      </Box>
      {isPrefixListOpen &&
        panelPosition &&
        createPortal(
            <Box
              ref={panelRef}
              sx={{
                position: 'fixed',
                top: panelPosition.top,
                left: panelPosition.left,
                width: panelPosition.width,
                zIndex: 1300,
                maxHeight: 320,
                overflowY: 'auto',
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.23)',
                borderRadius: 1,
                boxShadow: 4,
              }}
            >
              <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper', p: 1 }}>
                <TextField
                  autoFocus
                  fullWidth
                  size="small"
                  placeholder={translateText('app.global_dictionary.location_info.search_country_or_code')}
                  value={prefixSearchTerm}
                  onChange={(event) => setPrefixSearchTerm(event.target.value)}
                  onKeyDown={handlePrefixInputKeyDown}
                  autoComplete="off"
                />
              </Box>
              {filteredPrefixes.length === 0 && (
                <Box sx={{ px: 1.5, py: 1.5, opacity: 0.7 }}>
                  {translateText('app.global_dictionary.errors.NO_RESULTS')}
                </Box>
              )}
              {filteredPrefixes.map((prefix) => (
                <Box
                  key={prefix.iso2}
                  onClick={() => selectPrefix(prefix)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Flag code={prefix.iso2} height="14" />
                  <Box component="span" sx={{ minWidth: 52 }}>
                    {prefix.dialCode}
                  </Box>
                  <Box component="span">{prefix.name}</Box>
                </Box>
              ))}
            </Box>,
            document.body
          )}
    </>
  );
};

import { FormLabel } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectorCountries, useCountriesSlice } from '~/common/slices/parametrics/geo/country.redux';
import {
  selectorLocationEntities,
  useLocationEntitiesSlice,
} from '~/common/slices/parametrics/geo/location-entity.redux';
import { useI18n } from '~/common/utils';
import { getCountryStructure, getLevelConfig } from '~/common/utils/location-structure.utils';
import { CountryModel } from '~/models/parametrics/geo/country.model';
import { LocationEntityModel } from '~/models/parametrics/geo/location-entity.model';
import { ComponentGeneratorParams } from '../DynamicControl';
import { DynamicFieldData } from '../dynamic-control-types';
import { createSelect } from './Select';

export interface CitySelectorParams extends ComponentGeneratorParams {
  maxLevel?: number; // Maximum level to show (1-5)
  minLevel?: number; // Minimum required level (1-5)
  showCountrySelector?: boolean; // Whether to show country selection
  allowEmptyLevels?: boolean; // Allow skipping optional levels
}

export const createCitySelect = (citySelectorParams: CitySelectorParams) => {
  const {
    fieldData,
    handlers,
    formContext: externalContext,
    register: externalRegister,
    errors: externalErrors,
  } = citySelectorParams;

  const { componentParams = {}, defaultValue, config: fieldConfig } = fieldData || {};

  const { maxLevel = 3, minLevel = 1, showCountrySelector = true, allowEmptyLevels = true } = componentParams;
  const isFieldRequired = fieldConfig?.required === true || fieldConfig?.required === 'true';

  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { setValue, watch, register, formState } = finalContext;
  const { errors } = formState || {};

  // Helper component to render individual selectors
  const LevelSelector: React.FC<{
    fieldData: DynamicFieldData;
    handlers: any;
    indented?: boolean;
  }> = ({ fieldData: levelFieldData, handlers: levelHandlers, indented = false }) => {
    return (
      <div style={indented ? { paddingLeft: '1.5rem' } : undefined}>
        {createSelect({
          fieldData: levelFieldData,
          handlers: levelHandlers,
          register,
          errors,
          formContext: finalContext,
        })}
      </div>
    );
  };

  const dispatch = useDispatch();
  const { translateText } = useI18n();

  const { actions: countryActions } = useCountriesSlice();
  const { actions: locationEntityActions } = useLocationEntitiesSlice();

  const availableCountries = useSelector(selectorCountries.selectItems);
  const allLocationEntities = useSelector(selectorLocationEntities.selectItems);

  const [selectedCountry, setSelectedCountry] = useState<CountryModel | null>(null);
  const [selections, setSelections] = useState<Record<number, LocationEntityModel | null>>({});
  const [loadingLevels, setLoadingLevels] = useState<Record<number, boolean>>({});
  const autoSelectDoneRef = useRef<Record<number, boolean>>({});

  // === Load countries on mount
  useEffect(() => {
    dispatch(countryActions.loadItems({}));
  }, [dispatch, countryActions]);

  // === Compute structure
  const countryStructure = useMemo(
    () => (selectedCountry ? getCountryStructure(selectedCountry) : null),
    [selectedCountry]
  );

  const relevantLevels = useMemo(() => {
    if (!countryStructure) return [];
    return countryStructure.levels
      .filter((lvl) => lvl.level >= minLevel && lvl.level <= maxLevel)
      .sort((a, b) => a.level - b.level);
  }, [countryStructure, minLevel, maxLevel]);

  // === Load entities
  const loadLocationEntitiesForLevel = useCallback(
    (country: CountryModel, level: number, parentId?: string) => {
      setLoadingLevels((prev) => ({ ...prev, [level]: true }));

      const queryParams: any = {
        countryId: country.identifier,
        level,
        parentId: parentId ?? country.identifier,
      };

      dispatch(locationEntityActions.loadItems({ queryParams }));
    },
    [dispatch, locationEntityActions]
  );

  // === Field data builders
  const countryFieldName = fieldData?.fieldName ? `${fieldData.fieldName}_country` : 'country';
  const countryFieldData: DynamicFieldData = {
    label: translateText('app.global_dictionary.location.country'),
    fieldName: countryFieldName,
    inputType: 'select',
    options: availableCountries.map((country) => ({
      label: `${country.name}${country.name !== country.native ? ' (' + country.native + ')' : ''}`,
      value: country.identifier,
    })),
    config: { required: isFieldRequired },
  };

  // === Auto-select country from defaultValue
  useEffect(() => {
    if (!defaultValue?.country || !availableCountries.length) return;
    const defaultCountry = availableCountries.find((country) => country.identifier === defaultValue.country);
    if (defaultCountry) {
      setSelectedCountry(defaultCountry);
      setValue(countryFieldName, defaultCountry.identifier);
      loadLocationEntitiesForLevel(defaultCountry, 1);
    }
  }, [availableCountries]);

  // === Auto-select levels from defaultValue when entities become available
  useEffect(() => {
    if (!defaultValue || !selectedCountry || !relevantLevels.length) return;

    relevantLevels.forEach((lvl) => {
      if (autoSelectDoneRef.current[lvl.level]) return;

      const defaultLevelValue = defaultValue[`level${lvl.level}`];
      if (!defaultLevelValue) return;

      const parent = lvl.level === 1 ? selectedCountry : selections[lvl.level - 1];
      if (!parent) return;

      const entity = allLocationEntities.find((e) => e.id === defaultLevelValue);
      if (!entity) return;

      const levelFieldName = `${fieldData?.fieldName}_level${lvl.level}`;
      autoSelectDoneRef.current = { ...autoSelectDoneRef.current, [lvl.level]: true };
      setSelections((prev) => ({ ...prev, [lvl.level]: entity }));
      setValue(levelFieldName, entity.id);

      const nextLevel = relevantLevels.find((l) => l.level > lvl.level);
      if (nextLevel) {
        loadLocationEntitiesForLevel(selectedCountry!, nextLevel.level, entity.id);
      }
    });
  }, [allLocationEntities, selectedCountry, selections, relevantLevels]);

  const generateLevelFieldData = (level: number): DynamicFieldData | null => {
    if (!countryStructure) return null;

    const levelConfig = getLevelConfig(countryStructure, level);
    if (!levelConfig) return null;

    let options: { label: string; value: string }[] = [];
    const parent = level === 1 ? selectedCountry : selections[level - 1];

    if (parent) {
      options = allLocationEntities
        .filter(
          (e) => e.level === level && (level === 1 ? e.countryId === parent.identifier : e.parentId === parent.id)
        )
        .map((e) => ({ label: e.name, value: e.id }));
    }

    return {
      label: translateText(levelConfig.translationKey.replace('app.', 'app.global_dictionary.')),
      fieldName: `${fieldData?.fieldName}_level${level}`,
      inputType: 'select',
      options,
      placeholder: 'Seleccione...',
      config: {
        required: isFieldRequired && (levelConfig.required || !allowEmptyLevels),
        disabled: !parent,
      },
    };
  };

  const levelFieldsData = relevantLevels
    .map((lvl) => ({ level: lvl.level, fieldData: generateLevelFieldData(lvl.level) }))
    .filter((d) => d.fieldData !== null);

  // === Handlers
  const createLevelHandler = (level: number) => {
    const levelFieldName = `${fieldData?.fieldName}_level${level}`;
    return {
      [`onChange${levelFieldName}`]: (data: { value: string | null }) => {
        clearDescendants(level);
        if (!data?.value) {
          return;
        }

        // Si hay selección, setear entity y limpiar solo hijos
        const entity = allLocationEntities.find((e) => e.id === data.value);
        if (entity) {
          const newSelections = { ...selections, [level]: entity };
          setSelections(newSelections);
          setValue(levelFieldName, entity.id);

          const nextLevel = relevantLevels.find((l) => l.level > level);
          if (nextLevel) {
            loadLocationEntitiesForLevel(selectedCountry!, nextLevel.level, entity.id);
          }
        }
      },
    };
  };
  const countryHandlers = {
    [`onChange${countryFieldName}`]: (data: { value: string | null }) => {
      const selectedCountryModel =
        (data?.value && availableCountries.find((possibleCountry) => possibleCountry.identifier === data.value)) ||
        null;
      setSelectedCountry(selectedCountryModel);
      setSelections({});
      if (!data?.value) {
        relevantLevels.forEach((lvl) => setValue(`${fieldData?.fieldName}_level${lvl.level}`, null));
      } else {
        if (selectedCountryModel && selectedCountryModel !== selectedCountry) {
          loadLocationEntitiesForLevel(selectedCountryModel, 1);
          setSelectedCountry(selectedCountryModel);
          setSelections({});
        }
      }
      clearDescendants(minLevel - 1);

      if (selectedCountryModel !== selectedCountry) {
        loadLocationEntitiesForLevel(selectedCountryModel, 1);
      }
    },
  };

  const allHandlers = relevantLevels.reduce(
    (acc, lvl) => ({ ...acc, ...createLevelHandler(lvl.level) }),
    handlers || {}
  );

  const clearDescendants = (fromLevel: number) => {
    const newSelections = { ...selections };

    relevantLevels
      .filter((l) => l.level > fromLevel)
      .forEach((l) => {
        newSelections[l.level] = null;
        setValue(`${fieldData?.fieldName}_level${l.level}`, null);
      });

    setSelections(newSelections);
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <FormLabel required={isFieldRequired}>{fieldData?.label}</FormLabel>
      {showCountrySelector && <LevelSelector fieldData={countryFieldData} handlers={countryHandlers} indented />}
      {levelFieldsData.map(({ level, fieldData }) => {
        // 🚨 solo renderizo si su padre tiene selección
        if (level > 1 && !selections[level - 1]) return null;
        return (
          <div key={level}>
            <LevelSelector fieldData={fieldData!} handlers={allHandlers} indented />
          </div>
        );
      })}
    </div>
  );
};

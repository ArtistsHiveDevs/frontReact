import { FormLabel } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Flag from 'react-world-flags';
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

// Queue system to serialize entity loading requests from multiple CitySelector instances
type QueueItem = {
  dispatch: () => void;
  cacheKey: string;
  onComplete?: () => void;
};

type LoadingCallback = (isLoading: boolean) => void;

class CitySelectorQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private loadingCallbacks = new Map<string, LoadingCallback>();
  private processingCacheKey: string | null = null;

  enqueue(item: QueueItem) {
    this.queue.push(item);
    this.processQueue();
  }

  registerLoadingCallback(cacheKey: string, callback: LoadingCallback) {
    this.loadingCallbacks.set(cacheKey, callback);
  }

  unregisterLoadingCallback(cacheKey: string) {
    this.loadingCallbacks.delete(cacheKey);
  }

  private notifyLoading(cacheKey: string, isLoading: boolean) {
    const callback = this.loadingCallbacks.get(cacheKey);
    if (callback) {
      callback(isLoading);
    }
  }

  private processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift();

    if (item) {
      this.processingCacheKey = item.cacheKey;
      this.notifyLoading(item.cacheKey, true);
      item.dispatch();

      // Wait for Redux to process (takeLatest has a 500ms delay in the saga)
      // We add 200ms buffer to ensure the previous request completes
      setTimeout(() => {
        this.notifyLoading(item.cacheKey, false);
        this.processingCacheKey = null;
        this.isProcessing = false;
        if (item.onComplete) {
          item.onComplete();
        }
        this.processQueue(); // Process next item
      }, 700);
    }
  }

  isLoadingCacheKey(cacheKey: string): boolean {
    return this.processingCacheKey === cacheKey;
  }

  clear() {
    this.queue = [];
    this.isProcessing = false;
    this.processingCacheKey = null;
    this.loadingCallbacks.clear();
  }
}

export const citySelectorQueue = new CitySelectorQueue();

export interface CitySelectorParams extends ComponentGeneratorParams {
  maxLevel?: number; // Maximum level to show (1-5)
  minLevel?: number; // Minimum required level (1-5)
  showCountrySelector?: boolean; // Whether to show country selection
  allowEmptyLevels?: boolean; // Allow skipping optional levels
  element?: any; // The full element being edited
}

const CitySelectorComponent: React.FC<CitySelectorParams> = (citySelectorParams) => {
  const {
    fieldData,
    handlers,
    formContext: externalContext,
    register: externalRegister,
    errors: externalErrors,
    element,
  } = citySelectorParams;

  const {
    componentParams = {},
    defaultValue: initialDefaultValue,
    config: fieldConfig,
    externalData,
  } = fieldData || {};

  // Construir defaultValue desde elementData si está disponible (memoizado para evitar loops infinitos)
  const defaultValue = useMemo(() => {
    const elementData = externalData?.elementData;

    if (!elementData || !fieldData?.fieldName) {
      return initialDefaultValue;
    }

    // Convertir home_city -> homeCityData, birthplace -> birthplaceData
    const camelCaseFieldName = fieldData.fieldName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    const dataFieldName = `${camelCaseFieldName}Data`;
    const cityData = elementData[dataFieldName];

    if (Array.isArray(cityData) && cityData.length > 0) {
      // Convert array format to defaultValue object
      const defaultValueObj: any = {};

      cityData.forEach((item: any) => {
        if (item.level === 'country') {
          // El campo suelto es el fallback para respuestas que todavía no traen el id dentro del array.
          defaultValueObj.country = item.id || elementData[`${fieldData.fieldName}_country`];
        } else if (item.level === 'state') {
          defaultValueObj.level1 = item.id;
        } else if (item.level === 'city') {
          defaultValueObj.level2 = item.id;
        } else if (item.level === 'province') {
          // Some countries might use province instead of state
          defaultValueObj.level1 = item.id;
        }
        // Can extend for more levels if needed
      });

      if (Object.keys(defaultValueObj).length > 0) {
        return defaultValueObj;
      }
    }

    return initialDefaultValue;
  }, [initialDefaultValue, externalData?.elementData, fieldData?.fieldName]);

  const { maxLevel = 3, minLevel = 1, showCountrySelector = true, allowEmptyLevels = true } = componentParams;
  const isFieldRequired = fieldConfig?.required === true || fieldConfig?.required === 'true';

  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { setValue, watch, register, formState } = finalContext;
  const { errors } = formState || {};

  // Helper component to render individual selectors (memoized)
  const LevelSelector = useMemo(
    () =>
      React.memo<{
        fieldData: DynamicFieldData;
        handlers: any;
        indented?: boolean;
      }>(({ fieldData: levelFieldData, handlers: levelHandlers, indented = false }) => {
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
      }),
    [register, errors, finalContext]
  );

  const dispatch = useDispatch();
  const { translateGlobalDict } = useI18n();

  const { actions: countryActions } = useCountriesSlice();
  const { actions: locationEntityActions } = useLocationEntitiesSlice();

  const availableCountries = useSelector(selectorCountries.selectItems);
  const allLocationEntities = useSelector(selectorLocationEntities.selectItems);
  const countriesLoading = useSelector(selectorCountries.selectLoading);

  const [selectedCountry, setSelectedCountry] = useState<CountryModel | null>(null);
  const [selections, setSelections] = useState<Record<number, LocationEntityModel | null>>({});
  const [loadingLevels, setLoadingLevels] = useState<Record<number, boolean>>({});
  const autoSelectDoneRef = useRef<Record<number, boolean>>({});
  const isInitializingRef = useRef(false);
  const entitiesLoadedRef = useRef<Record<string, boolean>>({});
  const loadTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Load countries on mount
  useEffect(() => {
    dispatch(countryActions.loadItems({}));
  }, [dispatch, countryActions]);

  // Compute country structure from selected or default country
  const countryStructure = useMemo(() => {
    if (selectedCountry) {
      return getCountryStructure(selectedCountry);
    }

    // If we have a default country but haven't selected it yet, try to find it and get its structure
    if (defaultValue?.country && availableCountries.length > 0) {
      const defaultCountry = availableCountries.find((c) => c.identifier === defaultValue.country);
      if (defaultCountry) {
        return getCountryStructure(defaultCountry);
      }
    }

    return null;
  }, [selectedCountry, defaultValue?.country, availableCountries]);

  const relevantLevels = useMemo(() => {
    if (!countryStructure) return [];
    return countryStructure.levels
      .filter((lvl) => lvl.level >= minLevel && lvl.level <= maxLevel)
      .sort((a, b) => a.level - b.level);
  }, [countryStructure, minLevel, maxLevel]);

  const loadLocationEntitiesForLevel = useCallback(
    (country: CountryModel, level: number, parentId?: string, cacheKey?: string) => {
      const actualParentId = parentId ?? country.identifier;

      // Check if entities already exist for this level+parent
      const existingEntities = allLocationEntities.filter(
        (e) => e.level === level && (level === 1 ? e.countryId === actualParentId : e.parentId === actualParentId)
      );

      if (existingEntities.length > 0) {
        setLoadingLevels((prev) => ({ ...prev, [level]: false }));
        return;
      }

      const queryParams: any = {
        countryId: country.identifier,
        level,
        parentId: actualParentId,
      };

      setLoadingLevels((prev) => ({ ...prev, [level]: true }));
      dispatch(locationEntityActions.loadItemsAccumulate({ queryParams }));

      // Set a timeout to clear the loading flag if entities don't arrive within 10 seconds
      if (cacheKey) {
        // Clear any existing timeout for this cache key
        if (loadTimeoutRef.current[cacheKey]) {
          clearTimeout(loadTimeoutRef.current[cacheKey]);
        }

        loadTimeoutRef.current[cacheKey] = setTimeout(() => {
          delete entitiesLoadedRef.current[cacheKey];
          setLoadingLevels((prev) => ({ ...prev, [level]: false }));
          delete loadTimeoutRef.current[cacheKey];
        }, 10000);
      }
    },
    [dispatch, locationEntityActions, allLocationEntities, fieldData?.fieldName]
  );

  // === Field data builders
  const countryFieldName = useMemo(
    () => (fieldData?.fieldName ? `${fieldData.fieldName}_country` : 'country'),
    [fieldData?.fieldName]
  );

  const countryFieldData: DynamicFieldData = useMemo(
    () => ({
      label: translateGlobalDict('location.country'),
      fieldName: countryFieldName,
      inputType: 'select',
      options: availableCountries.map((country) => ({
        label: `${country.name}${country.name !== country.native ? ' (' + country.native + ')' : ''}`,
        value: country.identifier,
        icon: country.alpha2 ? <Flag code={country.alpha2} height="16" style={{ border: '1px solid #999' }} /> : null,
      })),
      placeholder: countriesLoading ? translateGlobalDict('request.states.loading') : 'Seleccione...',
      config: {
        required: isFieldRequired,
        disabled: countriesLoading,
      },
    }),
    [translateGlobalDict, countryFieldName, availableCountries, isFieldRequired, countriesLoading]
  );

  // Auto-select country from defaultValue
  const defaultValueSignature = useMemo(() => JSON.stringify(defaultValue || {}), [defaultValue]);
  const initializedCountryRef = useRef<string>();
  useEffect(() => {
    if (initializedCountryRef.current === defaultValueSignature) return;
    if (!defaultValue?.country || !availableCountries.length) return;

    const defaultCountry = availableCountries.find((country) => country.identifier === defaultValue.country);

    if (defaultCountry) {
      initializedCountryRef.current = defaultValueSignature;
      autoSelectDoneRef.current = {};
      isInitializingRef.current = true;

      const cacheKey = `1-${defaultCountry.identifier}`;
      entitiesLoadedRef.current[cacheKey] = true;

      queueMicrotask(() => {
        setSelectedCountry(defaultCountry);
        setValue(countryFieldName, defaultCountry.identifier);
        loadLocationEntitiesForLevel(defaultCountry, 1, defaultCountry.identifier, cacheKey);
      });
    }
  }, [
    availableCountries,
    defaultValue?.country,
    defaultValueSignature,
    countryFieldName,
    setValue,
    loadLocationEntitiesForLevel,
  ]);

  // Detect when entities finish loading and clear flags
  useEffect(() => {
    if (Object.keys(entitiesLoadedRef.current).length > 0) {
      const keysToDelete: string[] = [];

      Object.keys(entitiesLoadedRef.current).forEach((cacheKey) => {
        const [levelStr, parentId] = cacheKey.split('-');
        const level = parseInt(levelStr);

        const matchingEntities = allLocationEntities.filter(
          (e) => e.level === level && (level === 1 ? e.countryId === parentId : e.parentId === parentId)
        );

        if (matchingEntities.length > 0) {
          keysToDelete.push(cacheKey);
        }
      });

      // Delete keys outside of forEach to avoid mutation during iteration
      keysToDelete.forEach((key) => {
        delete entitiesLoadedRef.current[key];
        const level = parseInt(key.split('-')[0]);
        setLoadingLevels((prev) => ({ ...prev, [level]: false }));

        // Clear the timeout since entities have arrived
        if (loadTimeoutRef.current[key]) {
          clearTimeout(loadTimeoutRef.current[key]);
          delete loadTimeoutRef.current[key];
        }
      });
    }
  }, [allLocationEntities]);

  // === Auto-select levels from defaultValue when entities become available
  useEffect(() => {
    if (!isInitializingRef.current) return;
    if (!defaultValue || !selectedCountry || !relevantLevels.length) return;

    // Procesar niveles secuencialmente, uno a la vez
    for (const lvl of relevantLevels) {
      // Si ya está procesado, saltar
      if (autoSelectDoneRef.current[lvl.level]) continue;

      const defaultLevelValue = defaultValue[`level${lvl.level}`];
      if (!defaultLevelValue) {
        // No hay valor por defecto para este nivel, marcar como completo
        autoSelectDoneRef.current[lvl.level] = true;
        continue;
      }

      const parent = lvl.level === 1 ? selectedCountry : selections[lvl.level - 1];

      if (!parent && lvl.level > 1) {
        return;
      }

      // Buscar la entidad en las entidades cargadas
      // Buscar por identifier (ID del backend) en lugar de id (value)
      const entity = allLocationEntities.find((e) => e.identifier === defaultLevelValue || e.id === defaultLevelValue);

      // Si la entidad no está cargada, cargar entidades para este nivel
      if (!entity && parent) {
        const parentId = lvl.level === 1 ? selectedCountry.identifier : parent.id;
        const cacheKey = `${lvl.level}-${parentId}`;

        // Verificar si ya tenemos entidades para este nivel+parent cargadas
        const existingEntities = allLocationEntities.filter(
          (e) => e.level === lvl.level && (lvl.level === 1 ? e.countryId === parentId : e.parentId === parentId)
        );

        if (existingEntities.length > 0) {
          autoSelectDoneRef.current[lvl.level] = true;
          continue;
        }

        if (!entitiesLoadedRef.current[cacheKey]) {
          entitiesLoadedRef.current[cacheKey] = true;
          loadLocationEntitiesForLevel(selectedCountry, lvl.level, parentId, cacheKey);
        }
        return;
      }

      if (!entity) {
        autoSelectDoneRef.current[lvl.level] = true;
        continue;
      }

      const levelFieldName = `${fieldData?.fieldName}_level${lvl.level}`;

      if (selections[lvl.level]?.id !== entity.id) {
        queueMicrotask(() => {
          autoSelectDoneRef.current[lvl.level] = true;
          setSelections((prev) => ({ ...prev, [lvl.level]: entity }));
          setValue(levelFieldName, entity.id);

          // Cargar entidades del siguiente nivel si existe
          const nextLevel = relevantLevels.find((l) => l.level > lvl.level);
          if (nextLevel && defaultValue[`level${nextLevel.level}`]) {
            // Use identifier for parentId, not id (which is value)
            const nextParentId = entity.identifier;
            const cacheKey = `${nextLevel.level}-${nextParentId}`;
            if (!entitiesLoadedRef.current[cacheKey]) {
              entitiesLoadedRef.current[cacheKey] = true;
              loadLocationEntitiesForLevel(selectedCountry, nextLevel.level, nextParentId, cacheKey);
            }
          }
        });
        return; // Procesar un nivel a la vez
      }

      // Si llegamos aquí, el nivel ya está configurado
      autoSelectDoneRef.current[lvl.level] = true;
    }

    const allLevelsInitialized = relevantLevels.every(
      (lvl) => autoSelectDoneRef.current[lvl.level] || !defaultValue[`level${lvl.level}`]
    );
    if (allLevelsInitialized) {
      isInitializingRef.current = false;
    }
  }, [
    allLocationEntities,
    selectedCountry,
    relevantLevels,
    defaultValue,
    fieldData?.fieldName,
    setValue,
    loadLocationEntitiesForLevel,
    selections,
  ]);

  const generateLevelFieldData = (level: number): DynamicFieldData | null => {
    if (!countryStructure) return null;

    const levelConfig = getLevelConfig(countryStructure, level);
    if (!levelConfig) return null;

    let options: { label: string; value: string }[] = [];
    const parent = level === 1 ? selectedCountry : selections[level - 1];
    const isLoading = loadingLevels[level] || false;

    if (parent) {
      const filtered = allLocationEntities.filter(
        (e) => e.level === level && (level === 1 ? e.countryId === parent.identifier : e.parentId === parent.identifier)
      );

      options = filtered.map((e) => ({ label: e.name, value: e.id }));
    }

    return {
      label: translateGlobalDict(levelConfig.translationKey.replace('app.', '')),
      fieldName: `${fieldData?.fieldName}_level${level}`,
      inputType: 'select',
      options,
      placeholder: isLoading ? translateGlobalDict('request.states.loading') : 'Seleccione...',
      config: {
        required: isFieldRequired && (levelConfig.required || !allowEmptyLevels),
        disabled: !parent || isLoading,
      },
    };
  };

  const levelFieldsData = relevantLevels
    .map((lvl) => ({ level: lvl.level, fieldData: generateLevelFieldData(lvl.level) }))
    .filter((d) => d.fieldData !== null);

  // === Handlers
  const createLevelHandler = useCallback(
    (level: number) => {
      const levelFieldName = `${fieldData?.fieldName}_level${level}`;
      return {
        [`onChange${levelFieldName}`]: (data: { value: string | null }) => {
          // Limpiar flags de inicialización al editar manualmente
          isInitializingRef.current = false;

          // El país preseleccionado no queda dirty por sí solo y sin él el backend no resuelve los niveles.
          if (selectedCountry) {
            setValue(countryFieldName, selectedCountry.identifier, { shouldDirty: true });
          }

          if (!data?.value) {
            // Limpiar nivel actual y descendientes
            const newSelections = { ...selections };
            relevantLevels
              .filter((l) => l.level >= level)
              .forEach((l) => {
                newSelections[l.level] = null;
                setValue(`${fieldData?.fieldName}_level${l.level}`, null);
              });
            setSelections(newSelections);
            return;
          }

          // Si hay selección, setear entity y limpiar solo hijos
          const entity = allLocationEntities.find((e) => e.id === data.value);
          if (entity) {
            const newSelections = { ...selections, [level]: entity };

            // Limpiar niveles descendientes
            relevantLevels
              .filter((l) => l.level > level)
              .forEach((l) => {
                newSelections[l.level] = null;
                setValue(`${fieldData?.fieldName}_level${l.level}`, null);
              });

            setSelections(newSelections);
            setValue(levelFieldName, entity.id);

            const nextLevel = relevantLevels.find((l) => l.level > level);
            if (nextLevel && selectedCountry) {
              // Use identifier for parentId, not id (which is value)
              const nextParentId = entity.identifier;
              const cacheKey = `${nextLevel.level}-${nextParentId}`;
              if (!entitiesLoadedRef.current[cacheKey]) {
                entitiesLoadedRef.current[cacheKey] = true;
                loadLocationEntitiesForLevel(selectedCountry, nextLevel.level, nextParentId, cacheKey);
              }
            }
          }
        },
      };
    },
    [
      fieldData?.fieldName,
      countryFieldName,
      selections,
      allLocationEntities,
      relevantLevels,
      setValue,
      selectedCountry,
      loadLocationEntitiesForLevel,
    ]
  );
  const countryHandlers = useMemo(
    () => ({
      [`onChange${countryFieldName}`]: (data: { value: string | null }) => {
        const selectedCountryModel =
          (data?.value && availableCountries.find((possibleCountry) => possibleCountry.identifier === data.value)) ||
          null;

        if (!data?.value) {
          setSelectedCountry(null);
          setSelections({});
          relevantLevels.forEach((lvl) => setValue(`${fieldData?.fieldName}_level${lvl.level}`, null));
          return;
        }

        if (selectedCountryModel && selectedCountryModel.identifier !== selectedCountry?.identifier) {
          // Reset initialization flags when user manually changes country
          autoSelectDoneRef.current = {};
          isInitializingRef.current = false;
          entitiesLoadedRef.current = {}; // Clear loaded entities cache

          setSelectedCountry(selectedCountryModel);
          setSelections({});
          relevantLevels.forEach((lvl) => setValue(`${fieldData?.fieldName}_level${lvl.level}`, null));

          const cacheKey = `1-${selectedCountryModel.identifier}`;
          entitiesLoadedRef.current[cacheKey] = true;
          loadLocationEntitiesForLevel(selectedCountryModel, 1, selectedCountryModel.identifier, cacheKey);
        }
      },
    }),
    [
      countryFieldName,
      availableCountries,
      selectedCountry?.identifier,
      relevantLevels,
      fieldData?.fieldName,
      setValue,
      loadLocationEntitiesForLevel,
    ]
  );

  const allHandlers = useMemo(
    () => relevantLevels.reduce((acc, lvl) => ({ ...acc, ...createLevelHandler(lvl.level) }), handlers || {}),
    [relevantLevels, createLevelHandler, handlers]
  );

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

// Memoize the component to prevent unnecessary re-renders
// Custom comparison function to prevent re-renders when props haven't meaningfully changed
const MemoizedCitySelectorComponent = React.memo(CitySelectorComponent, (prevProps, nextProps) => {
  // Compare fieldData properties that matter
  const fieldDataEqual =
    prevProps.fieldData?.fieldName === nextProps.fieldData?.fieldName &&
    prevProps.fieldData?.inputType === nextProps.fieldData?.inputType &&
    JSON.stringify(prevProps.fieldData?.defaultValue) === JSON.stringify(nextProps.fieldData?.defaultValue) &&
    JSON.stringify(prevProps.fieldData?.componentParams) === JSON.stringify(nextProps.fieldData?.componentParams) &&
    JSON.stringify(prevProps.fieldData?.config) === JSON.stringify(nextProps.fieldData?.config);

  // Compare externalData.elementData by reference AND by fetchTimestamp
  // Sometimes the reference changes but it's the same data
  const prevElementData = prevProps.fieldData?.externalData?.elementData;
  const nextElementData = nextProps.fieldData?.externalData?.elementData;

  const externalDataEqual =
    prevElementData === nextElementData ||
    (prevElementData?.fetchTimestamp === nextElementData?.fetchTimestamp &&
      prevElementData?.identifier === nextElementData?.identifier);

  const errorsEqual =
    prevProps.errors === nextProps.errors ||
    (prevProps.errors?.type === nextProps.errors?.type && prevProps.errors?.message === nextProps.errors?.message);

  return fieldDataEqual && externalDataEqual && errorsEqual;
});

export const createCitySelect = (citySelectorParams: CitySelectorParams) => {
  return <MemoizedCitySelectorComponent {...citySelectorParams} />;
};

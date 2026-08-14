import { DEFAULT_COUNTRY_STRUCTURE, getCountryStructure } from '~/common/utils/location-structure.utils';
import { CountryModel } from '~/models/parametrics/geo/country.model';
import { LocationEntityModel } from '~/models/parametrics/geo/location-entity.model';

// Traduce las claves '<prefijo>_country'/'<prefijo>_level{N}' que genera CitySelector a los campos planos country/state/city que esperan los modelos de dominio.
export const buildLocationPayload = (
  data: Record<string, any>,
  fieldPrefix: string,
  availableCountries: CountryModel[],
  allLocationEntities: LocationEntityModel[]
): { country?: string; state?: string; city?: string } => {
  const countryId = data[`${fieldPrefix}_country`];
  const selectedCountry = availableCountries.find((country) => country.identifier === countryId);
  const countryStructure = selectedCountry ? getCountryStructure(selectedCountry) : DEFAULT_COUNTRY_STRUCTURE;

  const resolveLevelEntityName = (levelName: 'state' | 'city') => {
    const level = countryStructure.levels.find((structureLevel) => structureLevel.name === levelName)?.level;
    const entityId = level ? data[`${fieldPrefix}_level${level}`] : undefined;
    const entity = entityId
      ? allLocationEntities.find((locationEntity) => locationEntity.id === entityId && locationEntity.level === level)
      : undefined;
    return entity?.name;
  };

  return {
    country: countryId,
    state: resolveLevelEntityName('state'),
    city: resolveLevelEntityName('city'),
  };
};

// Quita las claves sueltas de CitySelector que no existen en el modelo de la entidad.
export const stripLocationSelectorFields = (payload: Record<string, any>, fieldPrefix: string) => {
  return Object.fromEntries(Object.entries(payload).filter(([key]) => !key.startsWith(`${fieldPrefix}_`)));
};

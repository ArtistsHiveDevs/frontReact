import { CountryModel, CountryStructure, CountryLevel } from '~/models/parametrics/geo/country.model';

/**
 * Default fallback structure for countries without defined structure
 */
export const DEFAULT_COUNTRY_STRUCTURE: CountryStructure = {
  levels: [
    {
      level: 1,
      name: 'state',
      translationKey: 'app.location.state',
      required: true,
    },
    {
      level: 2,
      name: 'city',
      translationKey: 'app.location.city',
      required: true,
    },
    {
      level: 3,
      name: 'district',
      translationKey: 'app.location.district',
      required: false,
    },
  ],
};

/**
 * Get country structure with fallback to default
 */
export const getCountryStructure = (country: CountryModel): CountryStructure => {
  // Use the structure from the country API response, or fallback to default
  return country.structure && country.structure.levels.length > 0 
    ? country.structure 
    : DEFAULT_COUNTRY_STRUCTURE;
};

/**
 * Get level configuration by level number
 */
export const getLevelConfig = (structure: CountryStructure, level: number): CountryLevel | undefined => {
  return structure.levels.find(l => l.level === level);
};

/**
 * Get maximum depth of a country structure
 */
export const getMaxDepth = (structure: CountryStructure): number => {
  return Math.max(...structure.levels.map(l => l.level));
};

/**
 * Get minimum required level for a country
 */
export const getMinRequiredLevel = (structure: CountryStructure): number => {
  const requiredLevels = structure.levels.filter(l => l.required);
  return requiredLevels.length > 0 ? Math.min(...requiredLevels.map(l => l.level)) : 1;
};

/**
 * Get maximum required level for a country
 */
export const getMaxRequiredLevel = (structure: CountryStructure): number => {
  const requiredLevels = structure.levels.filter(l => l.required);
  return requiredLevels.length > 0 ? Math.max(...requiredLevels.map(l => l.level)) : 1;
};

/**
 * Check if a level is required for a country
 */
export const isLevelRequired = (structure: CountryStructure, level: number): boolean => {
  const levelConfig = getLevelConfig(structure, level);
  return levelConfig?.required || false;
};

/**
 * Get all required levels for a country structure
 */
export const getRequiredLevels = (structure: CountryStructure): CountryLevel[] => {
  return structure.levels.filter(l => l.required).sort((a, b) => a.level - b.level);
};

/**
 * Get all optional levels for a country structure
 */
export const getOptionalLevels = (structure: CountryStructure): CountryLevel[] => {
  return structure.levels.filter(l => !l.required).sort((a, b) => a.level - b.level);
};

/**
 * Generate form field names based on structure
 */
export const generateFieldNames = (structure: CountryStructure): Record<number, string> => {
  return structure.levels.reduce((acc, level) => {
    acc[level.level] = level.name;
    return acc;
  }, {} as Record<number, string>);
};

/**
 * Check if structure includes a specific level
 */
export const hasLevel = (structure: CountryStructure, level: number): boolean => {
  return structure.levels.some(l => l.level === level);
};
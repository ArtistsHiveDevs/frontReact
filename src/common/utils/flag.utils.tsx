import React from 'react';
import Flag from 'react-world-flags';
import { CountryModel } from '~/models/parametrics/geo/country.model';
import { LocationEntityModel } from '~/models/parametrics/geo/location-entity.model';

export interface FlagProps {
  height?: string;
  width?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Default flag styling
 */
export const DEFAULT_FLAG_STYLE: React.CSSProperties = {
  border: '1px solid #999',
  borderRadius: '2px',
};

/**
 * Render flag for a country using alpha2 code
 */
export const renderCountryFlag = (country: CountryModel, props?: FlagProps) => {
  if (!country.alpha2) {
    return null;
  }

  return (
    <Flag
      code={country.alpha2}
      height={props?.height || '20'}
      width={props?.width}
      style={{ ...DEFAULT_FLAG_STYLE, ...props?.style }}
      className={props?.className}
    />
  );
};

/**
 * Render flag for a location entity (state, province, etc.)
 */
export const renderLocationEntityFlag = (entity: LocationEntityModel, props?: FlagProps) => {
  // If entity has a direct flagURL, use it as an image
  if (entity.flagURL) {
    return (
      <img
        src={entity.flagURL}
        alt={`${entity.name} flag`}
        height={props?.height || '20'}
        width={props?.width}
        style={{ ...DEFAULT_FLAG_STYLE, ...props?.style }}
        className={props?.className}
      />
    );
  }

  // If entity has alpha2 code, use react-world-flags
  if (entity.alpha2) {
    return (
      <Flag
        code={entity.alpha2}
        height={props?.height || '20'}
        width={props?.width}
        style={{ ...DEFAULT_FLAG_STYLE, ...props?.style }}
        className={props?.className}
      />
    );
  }

  return null;
};

/**
 * Check if country has a flag
 */
export const hasCountryFlag = (country: CountryModel): boolean => {
  return !!country.alpha2;
};

/**
 * Check if location entity has a flag
 */
export const hasLocationEntityFlag = (entity: LocationEntityModel): boolean => {
  return !!(entity.alpha2 || entity.flagURL);
};

/**
 * Get flag component for any location (country or entity)
 */
export const renderLocationFlag = (
  location: CountryModel | LocationEntityModel,
  props?: FlagProps
): React.ReactElement | null => {
  if (location instanceof CountryModel) {
    return renderCountryFlag(location, props);
  } else if (location instanceof LocationEntityModel) {
    return renderLocationEntityFlag(location, props);
  }
  return null;
};

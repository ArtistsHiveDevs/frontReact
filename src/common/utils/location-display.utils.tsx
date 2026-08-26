import Flag from 'react-world-flags';

export interface LocationLevelData {
  level: string;
  label: string;
  value: string;
  /** Sólo el país lo trae: es el ObjectId que usa el selector para preseleccionarlo. */
  id?: string;
}

const LEVEL_ORDER = ['city', 'state', 'country'];

const renderFlag = (countryAlpha2?: string) =>
  countryAlpha2 ? <Flag code={countryAlpha2} height="20" style={{ border: '1px solid #999' }} /> : <></>;

/** Formatea el array `<campo>Data` que envía el backend (city, state, country) con la bandera del país. */
export const formatLocationLevels = (locationData?: LocationLevelData[]) => {
  if (!locationData || !Array.isArray(locationData) || locationData.length === 0) {
    return undefined;
  }

  const sorted = [...locationData].sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
  const labels = sorted.map((item) => item.label).filter(Boolean);
  const countryAlpha2 = sorted.find((item) => item.level === 'country')?.value || '';

  return (
    <>
      {labels.join(', ')}
      {'  '}
      {renderFlag(countryAlpha2)}
    </>
  );
};

/** Formato legacy (city/country sueltos) para perfiles que todavía no tienen los niveles persistidos. */
export const formatLegacyLocation = (city?: string, country?: { name?: string; alpha2?: string }) => {
  if (!country?.name) {
    return undefined;
  }

  const labels = [city, country.name].filter(Boolean);

  return (
    <>
      {labels.join(', ')}
      {'  '}
      {renderFlag(country.alpha2)}
    </>
  );
};

import { allCountries } from 'country-telephone-data';

export interface PhonePrefix {
  iso2: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const DEFAULT_PHONE_PREFIX = '+57';

const REGIONAL_INDICATOR_OFFSET = 0x1f1e6 - 'A'.charCodeAt(0);

const flagFromIso2 = (iso2: string): string =>
  [...iso2].map((letter) => String.fromCodePoint(letter.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET)).join('');

const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['es'], { type: 'region' }) : null;

export const PHONE_PREFIXES: PhonePrefix[] = allCountries
  .map((country) => {
    const iso2 = country.iso2.toUpperCase();
    return {
      iso2,
      name: regionNames?.of(iso2) || country.name,
      dialCode: `+${country.dialCode}`,
      flag: flagFromIso2(iso2),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, 'es'));

export const DEFAULT_PHONE_PREFIX_OPTION =
  PHONE_PREFIXES.find((prefix) => prefix.dialCode === DEFAULT_PHONE_PREFIX) || PHONE_PREFIXES[0];

export interface ParsedPhoneValue {
  dialCode: string;
  number: string;
}

const PREFIXES_BY_DIAL_CODE_LENGTH = [...PHONE_PREFIXES].sort((a, b) => b.dialCode.length - a.dialCode.length);

export const parsePhoneValue = (value?: string): ParsedPhoneValue => {
  const trimmedValue = (value || '').trim();

  if (!trimmedValue.startsWith('+')) {
    return { dialCode: DEFAULT_PHONE_PREFIX, number: trimmedValue };
  }

  const matchedPrefix = PREFIXES_BY_DIAL_CODE_LENGTH.find((prefix) => trimmedValue.startsWith(prefix.dialCode));

  if (!matchedPrefix) {
    return { dialCode: DEFAULT_PHONE_PREFIX, number: trimmedValue };
  }

  return {
    dialCode: matchedPrefix.dialCode,
    number: trimmedValue.slice(matchedPrefix.dialCode.length).trim(),
  };
};

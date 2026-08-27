export const DEFAULT_PHONE_PREFIX = '+57';

export interface ParsedPhoneValue {
  dialCode: string;
  number: string;
}

const onlyDigits = (value: string) => value.replace(/\D/g, '');

export const parsePhoneValue = (value: string | undefined, availableDialCodes: string[]): ParsedPhoneValue => {
  const trimmedValue = (value || '').trim();

  if (!trimmedValue.startsWith('+')) {
    return { dialCode: DEFAULT_PHONE_PREFIX, number: onlyDigits(trimmedValue) };
  }

  const dialCodesByLength = [...availableDialCodes].sort((a, b) => b.length - a.length);
  const matchedDialCode = dialCodesByLength.find((dialCode) => trimmedValue.startsWith(dialCode));

  // Sin match el prefijo nunca se vuelca dentro del numero, para no duplicarlo al recomponer el valor.
  if (!matchedDialCode) {
    return { dialCode: DEFAULT_PHONE_PREFIX, number: onlyDigits(trimmedValue) };
  }

  return {
    dialCode: matchedDialCode,
    number: onlyDigits(trimmedValue.slice(matchedDialCode.length)),
  };
};

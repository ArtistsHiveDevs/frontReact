export const DEFAULT_PHONE_PREFIX = '+57';

export interface ParsedPhoneValue {
  dialCode: string;
  number: string;
}

export const parsePhoneValue = (value: string | undefined, availableDialCodes: string[]): ParsedPhoneValue => {
  const trimmedValue = (value || '').trim();

  if (!trimmedValue.startsWith('+')) {
    return { dialCode: DEFAULT_PHONE_PREFIX, number: trimmedValue };
  }

  const dialCodesByLength = [...availableDialCodes].sort((a, b) => b.length - a.length);
  const matchedDialCode = dialCodesByLength.find((dialCode) => trimmedValue.startsWith(dialCode));

  if (!matchedDialCode) {
    return { dialCode: DEFAULT_PHONE_PREFIX, number: trimmedValue };
  }

  return {
    dialCode: matchedDialCode,
    number: trimmedValue.slice(matchedDialCode.length).trim(),
  };
};

/**
 *
 * @param word
 */
export function capitalize(word: string): string {
  return word.substring(0, 1).toUpperCase() + word.substring(1);
}

/**
 *
 * @param word
 */
export function uncapitalize(word: string): string {
  return word.substring(0, 1).toLowerCase() + word.substring(1);
}

/**
 *
 * @param text
 * @param firstLower
 */
export function toCamelCase(text: string, firstLower: boolean = true): string {
  const regex =
    /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
  return text.match(regex).reduce((camelCase, word, index) => {
    return (
      camelCase +
      (firstLower && index === 0 ? uncapitalize(word) : capitalize(word))
    );
  }, "");
}

/**
 *
 * @param text
 * @returns
 */
export function removeSpecialChars(text: string) {
  return text
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

export function numberFormatterThousands(num: number, digits: number = 0) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}
export function currencyFormat(
  num: number,
  options?: {
    currency?: string;
    countryCurrency?: string;
    decimals?: number;
    thousandSeparator?: string;
    decimalsSeparator?: string;
    showCountryCurrency?: boolean;
  }
) {
  const {
    currency,
    countryCurrency,
    showCountryCurrency,
    decimals,
    thousandSeparator,
    decimalsSeparator,
  } = {
    currency: "$",
    countryCurrency: "USD",
    showCountryCurrency: false,
    decimals: 0,
    thousandSeparator: ".",
    decimalsSeparator: ",",
    ...options,
  };

  let countryCurrencyName = showCountryCurrency ? countryCurrency : "";
  const prefix = `${countryCurrencyName}${currency}`;
  const suffix = "";

  return (
    prefix +
    num
      .toFixed(decimals)
      .replace(".", decimalsSeparator)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandSeparator}`) +
    suffix
  );
}

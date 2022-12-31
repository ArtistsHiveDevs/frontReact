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

/**
 * Utility functions for handling visibility logic based on hidden properties
 */

/**
 * Type definition for hidden properties
 */
export type HiddenProperty = boolean | string | ((entityData?: any) => boolean) | undefined;

/**
 * Determines if an element should be visible based on a hidden property
 *
 * @param element - Object that may have a hidden property
 * @param entityData - Optional data to pass to hidden function if it's a function
 * @param propertyName - Name of the property to check (default: 'hidden')
 * @returns true if the element should be visible, false if it should be hidden
 *
 * @example
 * ```typescript
 * // Element without hidden property (visible by default)
 * isVisible({ name: 'test' }) // returns true
 *
 * // Element with hidden: false
 * isVisible({ hidden: false }) // returns true
 *
 * // Element with hidden: true
 * isVisible({ hidden: true }) // returns false
 *
 * // Element with hidden: 'true' (string)
 * isVisible({ hidden: 'true' }) // returns false
 *
 * // Element with hidden as function
 * isVisible({ hidden: (data) => data.type === 'admin' }, { type: 'user' }) // returns true
 * isVisible({ hidden: (data) => data.type === 'admin' }, { type: 'admin' }) // returns false
 *
 * // Using a custom property name
 * isVisible({ fullyHidden: true }, undefined, 'fullyHidden') // returns false
 * ```
 */
export const isVisible = (
  element: any,
  entityData?: any,
  propertyName: string = 'hidden'
): boolean => {
  // If element itself is null or undefined, consider it visible
  if (element === null || element === undefined) {
    return true;
  }

  const hiddenValue = element[propertyName];

  // If property is undefined, element is visible
  if (hiddenValue === undefined) {
    return true;
  }

  // If property is a boolean, return the opposite
  if (typeof hiddenValue === 'boolean') {
    return !hiddenValue;
  }

  // If property is a string, check if it's 'true'
  if (typeof hiddenValue === 'string') {
    return hiddenValue !== 'true';
  }

  // If property is a function, call it with entityData
  if (hiddenValue instanceof Function) {
    // Only evaluate the function if entityData is provided
    if (entityData) {
      return !hiddenValue(entityData);
    }
    // If no entityData is provided, assume visible
    return true;
  }

  // Default to visible
  return true;
};

/**
 * Filters an array of elements based on their visibility
 *
 * @param elements - Array of elements that may have a hidden property
 * @param entityData - Optional data to pass to hidden function
 * @param propertyName - Name of the property to check (default: 'hidden')
 * @returns Filtered array of visible elements
 *
 * @example
 * ```typescript
 * const sections = [
 *   { name: 'visible', hidden: false },
 *   { name: 'hidden', hidden: true },
 *   { name: 'conditional', hidden: (data) => data.hideConditional }
 * ];
 *
 * filterVisible(sections) // returns [{ name: 'visible' }]
 * filterVisible(sections, { hideConditional: false }) // returns [{ name: 'visible' }, { name: 'conditional' }]
 *
 * // Using custom property name
 * const items = [
 *   { name: 'a', fullyHidden: false },
 *   { name: 'b', fullyHidden: true }
 * ];
 * filterVisible(items, undefined, 'fullyHidden') // returns [{ name: 'a' }]
 * ```
 */
export const filterVisible = <T>(
  elements: T[],
  entityData?: any,
  propertyName: string = 'hidden'
): T[] => {
  return elements.filter((element) => isVisible(element, entityData, propertyName));
};

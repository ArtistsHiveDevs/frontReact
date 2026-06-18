/**
 * Common Helper Functions
 *
 * Shared utilities used across the list components.
 */

/**
 * Get nested value from object using dot notation or array notation
 *
 * Supports:
 * - Simple paths: 'name'
 * - Nested paths: 'user.name'
 * - Array paths: 'users[].name'
 * - Array indices: 'users[0].name'
 *
 * @param obj - Object to get value from
 * @param path - Path to the value
 * @returns The value at the path, or undefined
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;

  // Handle array notation (e.g., 'users[].name')
  if (path.includes('[]')) {
    return getArrayValues(obj, path);
  }

  // Handle simple array index (e.g., 'users[0].name')
  if (path.includes('[') && path.includes(']')) {
    return getIndexedValue(obj, path);
  }

  // Handle dot notation (e.g., 'user.name')
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
}

/**
 * Get values from array path (e.g., 'users[].name')
 */
function getArrayValues(obj: any, path: string): any[] {
  const [arrayPath, ...restPath] = path.split('[]');
  const arrayValue = getNestedValue(obj, arrayPath);

  if (!Array.isArray(arrayValue)) return [];

  if (restPath.length === 0) return arrayValue;

  const remainingPath = restPath.join('[]').replace(/^\./, '');
  return arrayValue.map(item => getNestedValue(item, remainingPath)).filter(v => v !== undefined);
}

/**
 * Get value from indexed array (e.g., 'users[0].name')
 */
function getIndexedValue(obj: any, path: string): any {
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;

    // Check if part is a number (array index)
    const index = parseInt(part, 10);
    if (!isNaN(index)) {
      current = current[index];
    } else {
      current = current[part];
    }
  }

  return current;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;

  const cloned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if two values are equal (deep comparison)
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }

  return true;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - suffix.length) + suffix;
}

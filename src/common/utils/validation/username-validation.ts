import { generatePreAuthHeaders } from '../request';

/**
 * Formato válido de username: solo minúsculas, dígitos, guión bajo y punto, 3-24 caracteres.
 * Debe mantenerse en sync con la validación equivalente del backend.
 */
export const USERNAME_FORMAT_PATTERN = /^[a-z0-9_.]{3,24}$/;

/**
 * Verifica si un username está disponible consultando el endpoint de checkId
 * @param username - El username a verificar
 * @param originalUsername - El username original (si está editando)
 * @returns Promise<boolean> - true si está disponible, false si ya existe
 */
export const checkUsernameAvailability = async (username: string, originalUsername?: string): Promise<boolean> => {
  // Validar que el username tenga al menos 3 caracteres
  if (!username || username.trim().length < 3) {
    return true; // No validar usernames muy cortos
  }

  // Si el username no ha cambiado, permitir continuar
  if (originalUsername && username.trim() === originalUsername.trim()) {
    return true;
  }

  const endpoint = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/cid/${username.trim()}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...generatePreAuthHeaders('username_signin'),
    };

    const response = await fetch(endpoint, { headers });

    const data = await response.json();

    const isAvailable = data?.data?.status === 'AVAILABLE';

    // El endpoint retorna { data: { status: "AVAILABLE" } } si está disponible
    // o { data: { status: "TAKEN", email: "..." } } si ya existe
    return isAvailable;
  } catch (error) {
    console.error('💥 [USERNAME VALIDATION] Error en validación:', error);
    // En caso de error, permitir continuar (no bloquear al usuario)
    return true;
  }
};

/**
 * Crea una función debounced que retrasa la ejecución hasta que haya pasado
 * un tiempo determinado sin que se vuelva a llamar
 * @param func - La función a ejecutar
 * @param delay - Tiempo de espera en milisegundos
 * @returns Función debounced
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        resolve(func(...args));
      }, delay);
    });
  };
}

/**
 * Factory function para crear validación con debounce que tiene acceso al username original
 * @param originalUsername - El username original del usuario (si existe)
 * @returns Función de validación debounced
 */
export const createDebouncedUsernameValidation = (originalUsername?: string) => {
  return debounce(
    async (value: string) => {
      const isAvailable = await checkUsernameAvailability(value, originalUsername);
      const result = isAvailable || 'Username is already taken';

      return result;
    },
    800 // 800ms de delay
  );
};

/**
 * Hook personalizado para validar username con debounce (sin originalUsername)
 * Uso en react-hook-form validate cuando no se necesita validar contra un valor original
 *
 * validate: {
 *   available: debouncedUsernameValidation
 * }
 */
export const debouncedUsernameValidation = debounce(
  async (value: string) => {
    const isAvailable = await checkUsernameAvailability(value);
    const result = isAvailable || 'Username is already taken';

    return result;
  },
  800 // 800ms de delay
);

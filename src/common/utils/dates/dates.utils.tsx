import dayjs, { Dayjs } from 'dayjs';

/**
 * Convierte un valor que puede ser string o Dayjs a Dayjs
 * Si ya es Dayjs, lo retorna tal cual
 * Si es string, lo convierte a Dayjs
 * Si es undefined/null, retorna undefined
 *
 * @param value - String ISO, Dayjs, o undefined
 * @returns Dayjs object o undefined
 *
 * @example
 * const date1 = ensureDayjs('2025-01-15T20:00:00Z'); // Dayjs
 * const date2 = ensureDayjs(dayjs()); // Dayjs (sin cambios)
 * const date3 = ensureDayjs(undefined); // undefined
 */
export const ensureDayjs = (value: string | Dayjs | undefined | null): Dayjs | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return dayjs(value);
  }

  // Ya es Dayjs
  return value;
};

/**
 * Convierte un Record de strings/Dayjs a Record de Dayjs
 * Útil para campos como last_viewed_by
 *
 * @param record - Record con valores string o Dayjs
 * @returns Record con valores Dayjs
 *
 * @example
 * const viewed = {
 *   'user1': '2025-01-15T10:00:00Z',
 *   'user2': dayjs(),
 * };
 * const converted = ensureDayjsRecord(viewed);
 * // { 'user1': Dayjs, 'user2': Dayjs }
 */
export const ensureDayjsRecord = (
  record: Record<string, string | Dayjs> | undefined
): Record<string, Dayjs> | undefined => {
  if (!record) {
    return undefined;
  }

  const result: Record<string, Dayjs> = {};

  Object.entries(record).forEach(([key, value]) => {
    const dayjsValue = ensureDayjs(value);
    if (dayjsValue) {
      result[key] = dayjsValue;
    }
  });

  return Object.keys(result).length > 0 ? result : undefined;
};

/**
 * Convierte un Dayjs a string ISO
 * Si es undefined, retorna undefined
 *
 * @param value - Dayjs object o undefined
 * @returns ISO string o undefined
 *
 * @example
 * const isoString = dayjsToISO(dayjs()); // '2025-01-15T20:00:00.000Z'
 * const nothing = dayjsToISO(undefined); // undefined
 */
export const dayjsToISO = (value: Dayjs | undefined): string | undefined => {
  return value?.toISOString();
};

/**
 * Convierte un Record de Dayjs a Record de strings ISO
 * Útil para serialización (toJSON)
 *
 * @param record - Record con valores Dayjs
 * @returns Record con valores string ISO
 *
 * @example
 * const viewed = {
 *   'user1': dayjs('2025-01-15'),
 *   'user2': dayjs('2025-01-16'),
 * };
 * const serialized = dayjsRecordToISO(viewed);
 * // { 'user1': '2025-01-15T00:00:00.000Z', 'user2': '2025-01-16T00:00:00.000Z' }
 */
export const dayjsRecordToISO = (
  record: Record<string, Dayjs> | undefined
): Record<string, string> | undefined => {
  if (!record) {
    return undefined;
  }

  const result: Record<string, string> = {};

  Object.entries(record).forEach(([key, value]) => {
    const isoString = dayjsToISO(value);
    if (isoString) {
      result[key] = isoString;
    }
  });

  return Object.keys(result).length > 0 ? result : undefined;
};

/**
 * Convierte un array de objetos con campo responded_at (u otro) a ISO strings
 * Útil para serialización de ParticipantApprovalStatus, ParticipantNote, etc.
 *
 * @param items - Array de objetos con campos de fecha
 * @param dateFields - Nombres de los campos que contienen fechas
 * @returns Array con campos de fecha convertidos a ISO strings
 *
 * @example
 * const approvals = [
 *   { participant_id: '1', responded_at: dayjs() },
 *   { participant_id: '2', responded_at: undefined }
 * ];
 * const serialized = serializeDateFields(approvals, ['responded_at']);
 */
export const serializeDateFields = <T extends Record<string, any>>(
  items: T[] | undefined,
  dateFields: (keyof T)[]
): any[] | undefined => {
  if (!items || items.length === 0) {
    return items;
  }

  return items.map((item) => {
    const serialized = { ...item };

    dateFields.forEach((field) => {
      const value = item[field];
      if (value && dayjs.isDayjs(value)) {
        serialized[field] = value.toISOString();
      }
    });

    return serialized;
  });
};

/**
 * Verifica si un valor es un Dayjs válido
 *
 * @param value - Cualquier valor
 * @returns true si es Dayjs y es válido
 *
 * @example
 * isValidDayjs(dayjs()); // true
 * isValidDayjs(dayjs('invalid')); // false
 * isValidDayjs('2025-01-15'); // false (es string, no Dayjs)
 */
export const isValidDayjs = (value: any): value is Dayjs => {
  return dayjs.isDayjs(value) && value.isValid();
};

/**
 * Obtiene el número de días entre dos fechas
 *
 * @param from - Fecha inicial
 * @param to - Fecha final
 * @returns Número de días (puede ser negativo si 'to' es anterior a 'from')
 *
 * @example
 * const days = daysBetween(dayjs('2025-01-01'), dayjs('2025-01-10')); // 9
 * const days2 = daysBetween(dayjs('2025-01-10'), dayjs('2025-01-01')); // -9
 */
export const daysBetween = (from: Dayjs, to: Dayjs): number => {
  return to.diff(from, 'day');
};

/**
 * Verifica si una fecha ha expirado (es anterior a ahora)
 *
 * @param date - Fecha a verificar
 * @returns true si la fecha ya pasó
 *
 * @example
 * isExpired(dayjs('2020-01-01')); // true
 * isExpired(dayjs().add(1, 'day')); // false
 */
export const isExpired = (date: Dayjs): boolean => {
  return dayjs().isAfter(date);
};

/**
 * Agrega días a una fecha (helper para deadline por defecto)
 *
 * @param baseDate - Fecha base (default: hoy)
 * @param days - Número de días a agregar (default: 90)
 * @returns Nueva fecha con días agregados
 *
 * @example
 * const deadline = addDays(dayjs(), 90); // 90 días desde hoy
 * const future = addDays(dayjs('2025-01-01'), 30); // 30 días desde 2025-01-01
 */
export const addDays = (baseDate: Dayjs = dayjs(), days: number = 90): Dayjs => {
  return baseDate.add(days, 'day');
};

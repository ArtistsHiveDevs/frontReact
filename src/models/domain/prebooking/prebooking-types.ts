import { Dayjs } from 'dayjs';

// ===== ENUMS =====

export enum PreBookingRequestStatus {
  DRAFT = 'DRAFT', // Borrador no enviado
  PENDING = 'PENDING', // Enviada, esperando respuestas (requester NO cuenta)
  PARTIALLY_VIEWED = 'PARTIALLY_VIEWED', // Algunos la vieron (sin contar requester)
  PARTIALLY_ACCEPTED = 'PARTIALLY_ACCEPTED', // Algunos aceptaron (sin contar requester)
  ALL_ACCEPTED = 'ALL_ACCEPTED', // Cumple mínimo: 1 de cada tipo
  REJECTED = 'REJECTED', // Todos de al menos un tipo rechazaron
  CANCELLED = 'CANCELLED', // Cancelada por solicitante
  CONVERTED = 'CONVERTED', // Convertida en evento
  EXPIRED = 'EXPIRED', // Expiró response_deadline (90 días default)
}

export enum ApprovalStatus {
  ALL_PENDING = 'ALL_PENDING', // Nadie ha respondido (excepto requester)
  PARTIAL = 'PARTIAL', // Algunos aceptaron (sin contar requester)
  ALL_APPROVED = 'ALL_APPROVED', // Al menos 1 de cada tipo aceptó
  REJECTED = 'REJECTED', // TODOS de un tipo rechazaron
}

export enum PrebookingParticipantStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  INTERESTED = 'interested',
  NOT_INTERESTED = 'not_interested',
}

export type RequestType = 'single_date' | 'date_range' | 'week' | 'month' | 'quarter';

// ===== INTERFACES =====

/**
 * Rango de fechas con hora y minuto
 * Usado para fechas alternativas con prioridad
 */
export interface DateRange {
  start: Dayjs; // Incluye fecha, hora y minuto
  end: Dayjs; // Incluye fecha, hora y minuto
  priority: number; // 1 = preferida, 2 = alternativa, etc.
}

/**
 * Estado de aprobación por participante individual
 */
export interface ParticipantApprovalStatus {
  participant_id: string;
  participant_type: string; // 'artist' | 'place' | 'booker' | etc.
  status: PrebookingParticipantStatus;
  responded_at?: Dayjs;
  response_notes?: string;
}

/**
 * Nota/comentario de un participante
 */
export interface ParticipantNote {
  author_id: string;
  author_name: string;
  note: string;
  created_at: Dayjs;
  is_private: boolean; // Solo visible para el autor
}

/**
 * Rango de costo - POSTPONED para V2
 * Muy complejo para V1 - Se manejará en EventModel
 */
// export interface CostRange {
//   min: number;
//   max: number;
//   is_negotiable: boolean;
//   includes_expenses: boolean;
// }

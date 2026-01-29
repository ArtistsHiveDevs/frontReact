import dayjs, { Dayjs } from 'dayjs';
import { dayjsToISO, ensureDayjs, ensureDayjsRecord, serializeDateFields } from '~/common/utils/dates/dates.utils';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { EntityModel } from '~/models/base/model';
import { EntityTemplate, ProfileTemplate } from '~/models/base/template';
import {
  ApprovalStatus,
  DateRange,
  ParticipantApprovalStatus,
  ParticipantNote,
  PrebookingParticipantStatus,
  PreBookingRequestStatus,
  RequestType,
} from './prebooking-types';

/**
 * Template para Pre-Reserva de Eventos (Multi-Party Support)
 * Sistema de "intención" de reserva previo a la creación de evento formal
 */
export interface PreBookingRequestTemplate extends EntityTemplate {
  // ===== PARTICIPANTES (Multi-party support) =====
  // Quien inicia la solicitud (puede ser artist, place, booker, etc.)
  requester?: CurrentProfileInfoModel; // Referencia completa al profile
  requester_user_id?: string; // ID para queries rápidos
  requester_profile_id?: string; // ID para queries rápidos

  // A quienes se solicita (puede ser múltiple: venue + varios artists)
  recipients: CurrentProfileInfoModel[]; // Array de perfiles involucrados
  recipient_ids: string[]; // IDs para queries

  // // Artistas/participantes adicionales que también deben aceptar
  // additional_participants: ProfileTemplate[]; // Todos deben aprobar
  // additional_participant_ids: string[];

  // Estado de aprobación por participante
  participant_approvals: ParticipantApprovalStatus[];

  // ===== DETALLES TEMPORALES (con hora y minuto) =====
  requested_date_start: Dayjs | string; // Fecha Y HORA inicio (ej: 2025-01-15 20:00)
  requested_date_end: Dayjs | string; // Fecha Y HORA fin (ej: 2025-01-15 23:30)
  request_type: RequestType;
  flexible_dates: boolean; // ¿Acepta fechas alternativas?
  alternative_dates?: DateRange[]; // Rangos alternativos si flexible (también con hora)

  // ===== DETALLES BÁSICOS =====
  event_name: string; // Nombre tentativo
  description: string; // Descripción breve
  // expected_attendance?: number;   // Asistencia esperada

  // ===== PRESUPUESTO (V2 - Removido por complejidad) =====
  // estimated_cost?: CostRange;   // Postponed - Muy complejo
  // currency?: string;             // Postponed

  // ===== ESTADO =====
  status: PreBookingRequestStatus;
  overall_approval_status: ApprovalStatus; // ALL_PENDING, PARTIAL, ALL_APPROVED, REJECTED

  // Notas por participante
  notes: ParticipantNote[]; // Cada uno puede agregar notas

  // ===== METADATA =====
  created_by: string; // user_id del creador
  event_id?: string; // Si se convierte en evento
  response_deadline: Dayjs | string; // Plazo para responder (DEFAULT: +90 días)
  // created_at: Dayjs | string;
  // updated_at: Dayjs | string;
  last_viewed_by?: Record<string, Dayjs | string>; // Tracking de vistas por user
}

/**
 * Modelo de Pre-Reserva de Evento
 *
 * Características:
 * - Multi-party: Soporta N artistas + M venues + bookers
 * - Aprobación por tipo: Requiere al menos 1 aprobación de cada tipo de perfil
 * - Auto-aprobación: El requester se aprueba automáticamente al crear
 * - Rechazo total: Solo si TODOS de un tipo rechazan
 * - Conversión a evento: Cuando ALL_APPROVED
 */
export class PreBookingRequestModel extends EntityModel<PreBookingRequestTemplate> {
  declare id: string;
  declare requester?: CurrentProfileInfoModel;
  declare requester_user_id?: string;
  declare requester_profile_id?: string;
  declare recipients: CurrentProfileInfoModel[];
  declare recipient_ids: string[];
  // declare additional_participants: ProfileTemplate[];
  // declare additional_participant_ids: string[];
  declare participant_approvals: ParticipantApprovalStatus[];
  declare requested_date_start: Dayjs;
  declare requested_date_end: Dayjs;
  declare request_type: RequestType;
  declare flexible_dates: boolean;
  declare alternative_dates?: DateRange[];
  declare event_name: string;
  declare description: string;
  // declare expected_attendance?: number;
  declare status: PreBookingRequestStatus;
  declare overall_approval_status: ApprovalStatus;
  declare notes: ParticipantNote[];
  declare created_by: string;
  declare event_id?: string;
  declare response_deadline: Dayjs;
  declare created_at: Dayjs;
  declare updated_at: Dayjs;
  declare last_viewed_by?: Record<string, Dayjs>;

  constructor(template: PreBookingRequestTemplate = {} as PreBookingRequestTemplate) {
    super(template);

    // Convertir fechas string a Dayjs usando helpers
    this.requester = !!template.requester ? new CurrentProfileInfoModel(template.requester) : undefined;
    this.requested_date_start = ensureDayjs(template.requested_date_start)!;
    this.requested_date_end = ensureDayjs(template.requested_date_end)!;
    this.response_deadline = ensureDayjs(template.response_deadline)!;
    // this.created_at = ensureDayjs(template.created_at)!;
    // this.updated_at = ensureDayjs(template.updated_at)!;

    this.status = PreBookingRequestStatus.DRAFT;

    // Convertir last_viewed_by Record usando helper
    this.last_viewed_by = ensureDayjsRecord(template.last_viewed_by);

    // Inicializar arrays vacíos si no existen
    this.recipients = template.recipients.map((recipient) => new CurrentProfileInfoModel(recipient)) || [];
    this.recipient_ids = template.recipient_ids || [];
    // this.additional_participants = template.additional_participants || [];
    // this.additional_participant_ids = template.additional_participant_ids || [];
    this.participant_approvals = template.participant_approvals || [];
    this.notes = template.notes || [];
    this.alternative_dates = template.alternative_dates;
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.event_name;
  }

  get artists(): CurrentProfileInfoModel[] {
    return this.recipients.filter((recipient) => recipient.entity === 'Artist');
  }

  get venues(): CurrentProfileInfoModel[] {
    return this.recipients.filter((recipient) => recipient.entity === 'Place');
  }

  // ===== MÉTODOS DE PERMISOS =====

  /**
   * Verifica si la solicitud está en estado activo (no finalizada)
   * Estados activos: DRAFT, PENDING, PARTIALLY_VIEWED, PARTIALLY_ACCEPTED, ALL_ACCEPTED
   * Estados finales: CANCELLED, CONVERTED, EXPIRED, REJECTED
   */
  isActive(): boolean {
    return ![
      PreBookingRequestStatus.CANCELLED,
      PreBookingRequestStatus.CONVERTED,
      PreBookingRequestStatus.EXPIRED,
      PreBookingRequestStatus.REJECTED,
    ].includes(this.status);
  }

  /**
   * Verifica si un usuario puede cancelar la solicitud
   * Solo el requester puede cancelar, y solo si no está CONVERTED/CANCELLED
   */
  canCancel(userId: string): boolean {
    return (
      this.requester_id === userId &&
      this.status !== PreBookingRequestStatus.CONVERTED &&
      this.status !== PreBookingRequestStatus.CANCELLED
    );
  }

  /**
   * Verifica si un usuario puede editar la solicitud
   * Solo el requester puede editar, y solo en estado DRAFT o PENDING
   */
  canEdit(userId: string): boolean {
    return (
      this.requester_id === userId &&
      (this.status === PreBookingRequestStatus.DRAFT || this.status === PreBookingRequestStatus.PENDING)
    );
  }

  /**
   * Verifica si un usuario puede aprobar/rechazar la solicitud
   * El usuario debe ser participante (recipient o additional) y no ser el requester
   */
  canApprove(userId: string): boolean {
    // No puede aprobar si es el requester (ya está auto-aprobado)
    if (this.requester_id === userId) {
      return false;
    }

    // Buscar en participant_approvals
    const approval = this.participant_approvals.find((a) => a.participant_profile_id === userId);

    // Puede aprobar si es participante y está en pending o viewed
    return !!approval && approval.status === PrebookingParticipantStatus.PENDING;
  }

  /**
   * Verifica si un usuario puede convertir la solicitud a evento
   * Solo el requester puede convertir, y solo si ALL_ACCEPTED
   */
  canConvert(userId: string): boolean {
    return (
      this.requester_id === userId &&
      this.overall_approval_status === ApprovalStatus.ALL_APPROVED &&
      this.status === PreBookingRequestStatus.ALL_ACCEPTED
    );
  }

  // ===== MÉTODOS DE ESTADO =====

  /**
   * Obtiene el estado de aprobación de un usuario específico
   */
  getUserApprovalStatus(userId: string): ParticipantApprovalStatus | undefined {
    return this.participant_approvals.find((a) => a.participant_profile_id === userId);
  }

  /**
   * Obtiene todos los participantes (requester + recipients + additional)
   */
  getAllParticipants(): ProfileTemplate[] {
    return [this.requester, ...this.recipients, ...this.additional_participants];
  }

  /**
   * Obtiene todos los IDs de participantes
   */
  getAllParticipantIds(): string[] {
    return [this.requester_id, ...this.recipient_ids, ...this.additional_participant_ids];
  }

  /**
   * Obtiene los tipos únicos de perfiles requeridos (sin contar requester)
   * Ejemplo: ['artist', 'place'] o ['artist', 'place', 'booker']
   */
  getRequiredProfileTypes(): string[] {
    const types = new Set<string>();

    // Agregar tipos de todos los participantes (incluido requester)
    this.participant_approvals.forEach((approval) => {
      types.add(approval.participant_type);
    });

    return Array.from(types);
  }

  /**
   * Obtiene aprobaciones filtradas por tipo de perfil
   */
  getApprovalsByProfileType(type: string): ParticipantApprovalStatus[] {
    return this.participant_approvals.filter((a) => a.participant_type === type);
  }

  // ===== LÓGICA DE APROBACIÓN MULTI-PARTY =====

  /**
   * CLAVE: Valida que haya al menos UNA aprobación de cada tipo de perfil
   *
   * Reglas:
   * 1. Se requiere mínimo 1 ACCEPTED de cada tipo de perfil
   * 2. El requester se auto-aprueba al crear (ya cuenta para su tipo)
   * 3. Ejemplo: 3 artists (1 acepta) + 2 places (1 acepta) → TRUE
   * 4. Ejemplo: 3 artists (0 aceptan, solo requester) + 2 places (1 acepta) → TRUE si requester es artist
   */
  hasMinimumApprovalsPerType(): boolean {
    const requiredTypes = this.getRequiredProfileTypes();

    // Para cada tipo requerido, verificar que al menos 1 persona aprobó
    return requiredTypes.every((type) => {
      const approvalsOfType = this.getApprovalsByProfileType(type);
      const acceptedCount = approvalsOfType.filter((a) => a.status === PrebookingParticipantStatus.INTERESTED).length;

      return acceptedCount >= 1;
    });
  }

  /**
   * Verifica si TODOS los participantes de un tipo específico rechazaron
   * (excluyendo al requester del conteo)
   *
   * Reglas:
   * - Solo cuenta participantes NO-requester
   * - Si hay 3 artists (no-requester) y los 3 rechazan → TRUE
   * - Si hay 3 artists y 2 rechazan, 1 acepta → FALSE
   *
   * Casos especiales:
   * - Si requester es el ÚNICO de su tipo → No aplica (no puede rechazarse a sí mismo)
   * - Si requester + 2 más de su tipo, y los 2 otros rechazan → TRUE (todos los NO-requester rechazaron)
   */
  isFullyRejectedByType(type: string): boolean {
    const approvalsOfType = this.getApprovalsByProfileType(type);

    // Filtrar solo NO-requester
    const nonRequesterApprovals = approvalsOfType.filter((a) => a.participant_profile_id !== this.requester_id);

    // Si no hay participantes no-requester de este tipo, no puede estar rechazado
    if (nonRequesterApprovals.length === 0) {
      return false;
    }

    // Verificar que TODOS los no-requester hayan rechazado
    return nonRequesterApprovals.every((a) => a.status === PrebookingParticipantStatus.NOT_INTERESTED);
  }

  /**
   * Verifica si la solicitud debería estar RECHAZADA
   * (si TODOS los participantes de AL MENOS UN tipo rechazaron)
   *
   * Ejemplos:
   * - 3 artists (TODOS rechazan) + 1 place (acepta) → TRUE (rechazada)
   * - 2 artists (1 acepta, 1 rechaza) + 1 place (rechaza) → TRUE (solo 1 place y rechazó)
   * - 2 artists (1 acepta, 1 rechaza) + 2 places (1 acepta, 1 rechaza) → FALSE
   */
  shouldBeRejected(): boolean {
    const requiredTypes = this.getRequiredProfileTypes();

    // Si al menos un tipo tiene TODOS sus participantes rechazados → REJECTED
    return requiredTypes.some((type) => this.isFullyRejectedByType(type));
  }

  /**
   * Auto-aprueba al requester al crear la solicitud
   * Marca su ParticipantApprovalStatus como ACCEPTED
   */
  autoApproveRequester(): void {
    const requesterApproval = this.participant_approvals.find((a) => a.participant_profile_id === this.requester_id);

    if (requesterApproval) {
      requesterApproval.status = PrebookingParticipantStatus.INTERESTED;
      requesterApproval.responded_at = dayjs();
    }
  }

  /**
   * Actualiza el overall_approval_status basado en los approval states actuales
   *
   * Lógica:
   * 1. Si shouldBeRejected() → REJECTED
   * 2. Si hasMinimumApprovalsPerType() → ALL_APPROVED
   * 3. Si alguno aceptó (sin contar requester) → PARTIAL
   * 4. Si nadie respondió (sin contar requester) → ALL_PENDING
   */
  updateOverallApprovalStatus(): void {
    // Caso 1: Rechazo total de al menos un tipo
    if (this.shouldBeRejected()) {
      this.overall_approval_status = ApprovalStatus.REJECTED;
      this.status = PreBookingRequestStatus.REJECTED;
      return;
    }

    // Caso 2: Aprobación mínima cumplida
    if (this.hasMinimumApprovalsPerType()) {
      this.overall_approval_status = ApprovalStatus.ALL_APPROVED;
      this.status = PreBookingRequestStatus.ALL_ACCEPTED;
      return;
    }

    // Contar aprobaciones y respuestas (sin contar requester)
    const nonRequesterApprovals = this.participant_approvals.filter(
      (a) => a.participant_profile_id !== this.requester_id
    );
    const acceptedCount = nonRequesterApprovals.filter(
      (a) => a.status === PrebookingParticipantStatus.INTERESTED
    ).length;
    const respondedCount = nonRequesterApprovals.filter(
      (a) =>
        a.status === PrebookingParticipantStatus.INTERESTED || a.status === PrebookingParticipantStatus.NOT_INTERESTED
    ).length;

    // Caso 3: Algunos aceptaron (parcial)
    if (acceptedCount > 0) {
      this.overall_approval_status = ApprovalStatus.PARTIAL;
      this.status = PreBookingRequestStatus.PARTIALLY_ACCEPTED;
      return;
    }

    // Caso 4: Nadie ha respondido aún
    if (respondedCount === 0) {
      this.overall_approval_status = ApprovalStatus.ALL_PENDING;
      this.status = PreBookingRequestStatus.PENDING;
      return;
    }

    // Default: Partial
    this.overall_approval_status = ApprovalStatus.PARTIAL;
    this.status = PreBookingRequestStatus.PENDING;
  }

  /**
   * Verifica si la solicitud ha expirado
   */
  isExpired(): boolean {
    return dayjs().isAfter(this.response_deadline);
  }

  /**
   * Marca la solicitud como vista por un usuario
   */
  markAsViewedBy(userId: string): void {
    if (!this.last_viewed_by) {
      this.last_viewed_by = {};
    }
    this.last_viewed_by[userId] = dayjs();

    // Actualizar el estado del participante a 'viewed' si estaba en 'pending'
    const approval = this.participant_approvals.find((a) => a.participant_profile_id === userId);
  }

  /**
   * Agrega una nota al thread de notas
   */
  addNote(
    authorUserId: string,
    authorProfileId: string,
    authorName: string,
    note: string,
    isPrivate: boolean = false
  ): void {
    this.notes.push({
      author_user_id: authorUserId,
      author_profile_id: authorProfileId,
      author_name: authorName,
      note,
      created_at: dayjs(),
      is_private: isPrivate,
    });
  }

  /**
   * Obtiene notas visibles para un usuario específico
   * (públicas + sus propias privadas)
   */
  getVisibleNotesForUser(userId: string): ParticipantNote[] {
    return this.notes.filter((note) => !note.is_private || note.author_profile_id === userId);
  }

  /**
   * Serializa el modelo para envío a backend
   */
  toJSON(): any {
    return {
      id: this.id,
      // requester: this.requester,
      // requester_user_id: this.requester_user_id,
      // requester_profile_id: this.requester_profile_id,
      recipients: this.recipients,
      recipient_ids: this.recipient_ids,
      // additional_participants: this.additional_participants,
      // additional_participant_ids: this.additional_participant_ids,
      // participant_approvals: serializeDateFields(this.participant_approvals, ['responded_at']),
      requested_date_start: dayjsToISO(this.requested_date_start),
      requested_date_end: dayjsToISO(this.requested_date_end),
      request_type: this.request_type,
      flexible_dates: this.flexible_dates,
      alternative_dates: serializeDateFields(this.alternative_dates, ['start', 'end']),
      event_name: this.event_name,
      description: this.description,
      // expected_attendance: this.expected_attendance,
      // status: this.status,
      // overall_approval_status: this.overall_approval_status,
      notes: serializeDateFields(this.notes, ['created_at']),
      // created_by: this.created_by,
      // event_id: this.event_id,
      response_deadline: dayjsToISO(this.response_deadline),
      // created_at: dayjsToISO(this.created_at),
      // updated_at: dayjsToISO(this.updated_at),
      // last_viewed_by: dayjsRecordToISO(this.last_viewed_by),
    };
  }
}

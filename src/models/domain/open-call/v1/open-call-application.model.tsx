import dayjs, { Dayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { PopulatedEntityRef, resolvePopulatedRefId } from '~/models/base/modelHelpers';

export type OpenCallApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface OpenCallApplicationTemplate extends EntityTemplate {
  // El backend los populate (Mongoose), por lo que llegan como sub-documento y no como id plano.
  open_call_id: string | PopulatedEntityRef;
  artist_id?: string | PopulatedEntityRef;
  artist_name?: string;
  artist_profile_pic?: string;
  artist_city?: string;
  status?: OpenCallApplicationStatus;
  survey_responses?: Record<string, any>;
  createdAt?: string;
}

export class OpenCallApplicationModel
  extends EntityModel<OpenCallApplicationTemplate>
  implements OpenCallApplicationTemplate
{
  declare open_call_id: string | PopulatedEntityRef;
  declare artist_id?: string | PopulatedEntityRef;
  declare artist_name?: string;
  declare artist_profile_pic?: string;
  declare artist_city?: string;
  declare status: OpenCallApplicationStatus;
  declare survey_responses?: Record<string, any>;
  declare createdAt?: string;

  constructor(template: OpenCallApplicationTemplate) {
    super(template);
    this.status = template.status || 'pending';
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.open_call_id;
  }

  get cardInfo() {
    return { title: this.artist_name, subtitle: this.status };
  }

  get openCallId(): string | undefined {
    return resolvePopulatedRefId(this.open_call_id);
  }

  get artistId(): string | undefined {
    return resolvePopulatedRefId(this.artist_id);
  }

  get openCallSummary(): PopulatedEntityRef | undefined {
    return this.open_call_id && typeof this.open_call_id !== 'string' ? this.open_call_id : undefined;
  }

  /**
   * Retorna true si la aplicación está pendiente de revisión
   */
  get isPending(): boolean {
    return this.status === 'pending';
  }

  /**
   * Retorna true si la aplicación fue aceptada
   */
  get isAccepted(): boolean {
    return this.status === 'accepted';
  }

  /**
   * Retorna true si la aplicación fue rechazada
   */
  get isRejected(): boolean {
    return this.status === 'rejected';
  }

  /**
   * Retorna la fecha de creación como Dayjs
   */
  get applicationDate(): Dayjs | undefined {
    return this.createdAt ? dayjs(this.createdAt) : undefined;
  }

  /**
   * Obtiene una respuesta específica del formulario dinámico
   * @param fieldName - Nombre del campo
   * @returns Valor de la respuesta o undefined
   */
  getSurveyResponse(fieldName: string): any {
    return this.survey_responses?.[fieldName];
  }
}

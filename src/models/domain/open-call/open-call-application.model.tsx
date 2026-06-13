import { EntityModel, EntityTemplate } from '~/models/base';

export type OpenCallApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface OpenCallApplicationTemplate extends EntityTemplate {
  open_call_id: string;
  artist_id?: string;
  artist_name?: string;
  artist_profile_pic?: string;
  artist_city?: string;
  status?: OpenCallApplicationStatus;
  survey_responses?: Record<string, any>;
}

export class OpenCallApplicationModel
  extends EntityModel<OpenCallApplicationTemplate>
  implements OpenCallApplicationTemplate
{
  declare open_call_id: string;
  declare artist_id?: string;
  declare artist_name?: string;
  declare artist_profile_pic?: string;
  declare artist_city?: string;
  declare status: OpenCallApplicationStatus;
  declare survey_responses?: Record<string, any>;

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
}

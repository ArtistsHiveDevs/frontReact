import { Moment } from 'moment';
import { EntityModel, EntityTemplate } from '~/models/base';

export interface PrivacyPolicyTemplate extends EntityTemplate {
  version: string;
  initial_date: Moment;
  final_date: Moment;
  current: boolean;
  draft: boolean;
  policy: string;
}

export class PrivacyPolicyModel extends EntityModel<PrivacyPolicyTemplate> {
  declare version: string;
  declare initial_date: Moment;
  declare final_date: Moment;
  declare current: boolean;
  declare draft: boolean;
  declare policy: string;
}

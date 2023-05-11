import { Moment } from "moment";
import { EntityModel, EntityTemplate } from "~/models/base";

export interface TermsAndConditionsTemplate extends EntityTemplate {
  version: string;
  initial_date: Moment;
  final_date: Moment;
  current: boolean;
  draft: boolean;
  terms: string;
}

export class TermsAndConditionsModel extends EntityModel<TermsAndConditionsTemplate> {
  declare version: string;
  declare initial_date: Moment;
  declare final_date: Moment;
  declare current: boolean;
  declare draft: boolean;
  declare terms: string;
}

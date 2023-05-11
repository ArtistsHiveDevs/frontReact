import { EntityModel, EntityTemplate } from "~/models/base";

export interface GeneralMusicalInstrumentTemplate extends EntityTemplate {
  family: string;
  name: string;
  abbreviation?: string;
  description: string;
  photo: string;
}
export class GeneralMusicalInstrumentModel
  extends EntityModel<GeneralMusicalInstrumentTemplate>
  implements GeneralMusicalInstrumentTemplate
{
  declare family: string;
  declare name: string;
  declare abbreviation?: string;
  declare description: string;
  declare photo: string;
}

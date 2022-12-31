import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate } from "~/models/base";

export interface ArtistTemplate extends EntityTemplate {
  artistType: string;
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic?: string;
  photo?: string;
  description: string;
  date?: Date;
}

export class ArtistModel
  extends EntityModel<ArtistTemplate>
  implements ArtistTemplate
{
  declare artistType: string;
  declare name: string;
  declare subtitle: string;
  declare verified_status: VerificationStatus;
  declare profile_pic?: string;
  declare photo?: string;
  declare description: string;
  declare date?: Date;
}

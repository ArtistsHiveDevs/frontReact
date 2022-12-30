import { VerificationStatus } from "~/constants";

export interface ArtistTemplate {
  artistType: string;
  id: string;
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic?: string;
  photo?: string;
  description: string;
  date?: Date;
}

export class ArtistModel implements ArtistTemplate {
  artistType: string;
  id: string;
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic: string | undefined;
  photo: string | undefined;
  description: string;
  date?: Date;

  constructor(private readonly template: ArtistTemplate) {
    this.artistType = this.template.artistType;
    this.id = this.template.id;
    this.name = this.template.name;
    this.subtitle = this.template.subtitle;
    this.verified_status = this.template.verified_status;
    this.profile_pic = this.template.profile_pic;
    this.photo = this.template.photo;
    this.description = this.template.description;
    this.date = this.template.date;
  }
}

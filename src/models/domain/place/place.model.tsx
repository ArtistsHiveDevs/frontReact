import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate } from "~/models/base";

export interface PlaceTemplate extends EntityTemplate {
  name: string;
  place_type: string;
  music_genre: string;
  country: string;
  state: string;
  city: string;
  address: string;
  location: string;
  email: string;
  phone: string;
  public_private: string;
  facebook: string;
  instagram: string;
  twitter: string;
  website: string;
  promoter: string;
  tiktok: string;
  profile_pic: string;
}

export class PlaceModel
  extends EntityModel<PlaceTemplate>
  implements PlaceTemplate
{
  declare name: string;
  declare place_type: string;
  declare music_genre: string;
  declare country: string;
  declare state: string;
  declare city: string;
  declare address: string;
  declare location: string;
  declare email: string;
  declare phone: string;
  declare public_private: string;
  declare facebook: string;
  declare instagram: string;
  declare twitter: string;
  declare website: string;
  declare promoter: string;
  declare tiktok: string;
  declare profile_pic: string;

  public get photo() {
    return this.profile_pic;
  }

  public get cardInfo() {
    return { title: this.name };
  }

  public get place() {
    return this;
  }

  get cityWithCountry() {
    return `${this.city}, ${this.country}`;
  }

  get latitude() {
    return parseFloat(this.location?.split(",")[0] || "0");
  }

  get longitude() {
    return parseFloat(this.location?.split(",")[1] || "0");
  }

  get latLng() {
    return { lat: this.latitude, lng: this.longitude };
  }
}

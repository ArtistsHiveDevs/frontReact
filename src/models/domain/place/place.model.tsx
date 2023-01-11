import moment from "moment";
import { EntityModel, EntityTemplate } from "~/models/base";
import { EventModel, EventTemplate } from "../event/event.model";

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
  imageGallery: Image[];

  events: EventTemplate[];
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
  declare imageGallery: Image[];
  declare events: EventTemplate[];

  constructor(template: PlaceTemplate) {
    super(template);
    this.events = template.events?.map((event) => new EventModel(event)) || [];
  }

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

  get pastEvents() {
    return this.events
      .filter((event) =>
        moment(event.timetable__initial_date).isBefore(moment())
      )
      .sort((e1, e2) => {
        const date1 = e1.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        const date2 = e2.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        if (date1 < date2) {
          return -1;
        } else if (date1 > date2) {
          return 1;
        }
        // names must be equal
        return 0;
      })
      .reverse();
  }

  get nextEvents() {
    return this.events
      .filter((event) =>
        moment(event.timetable__initial_date).isSameOrAfter(moment())
      )
      .sort((e1, e2) => {
        const date1 = e1.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        const date2 = e2.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        if (date1 < date2) {
          return -1;
        } else if (date1 > date2) {
          return 1;
        }
        // names must be equal
        return 0;
      });
  }
}

export interface Image {
  src: string;
  alt?: string;
}

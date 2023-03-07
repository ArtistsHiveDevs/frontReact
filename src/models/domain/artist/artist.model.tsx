import moment from "moment";
import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate, SearchableTemplate } from "~/models/base";
import { EventModel, EventTemplate } from "../event/event.model";

export interface ArtistTemplate extends EntityTemplate {
  artistType: string;
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic?: string;
  photo?: string;
  description: string;
  date?: Date;
  events: EventTemplate[];
  genres: { [artType: string]: string[] };

  since: number;
  home_city: string;
  spoken_languages: string[];
  stage_languages: string[];
  arts_languages: string[];

  website: string;
  email: string;
  mobile_phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  spotify: string;
  youtube: string;
  youtube_widget_id: string;
}

export class ArtistModel
  extends EntityModel<ArtistTemplate>
  implements ArtistTemplate, SearchableTemplate
{
  declare artistType: string;
  declare name: string;
  declare subtitle: string;
  declare verified_status: VerificationStatus;
  declare profile_pic?: string;
  declare photo?: string;
  declare description: string;
  declare date?: Date;

  declare events: EventTemplate[];
  declare genres: { [artType: string]: string[] };

  declare since: number;
  declare home_city: string;
  declare spoken_languages: string[];
  declare stage_languages: string[];
  declare arts_languages: string[];

  declare website: string;
  declare email: string;
  declare mobile_phone: string;
  declare whatsapp: string;
  declare facebook: string;
  declare instagram: string;
  declare spotify: string;
  declare youtube: string;
  declare youtube_widget_id: string;

  constructor(template: ArtistTemplate) {
    super(template);
    this.events = template.events?.map((event) => new EventModel(event)) || [];
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

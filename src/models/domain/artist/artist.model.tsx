import moment from "moment";
import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate, SearchableTemplate } from "~/models/base";
import { EventModel, EventTemplate } from "../event/event.model";

export interface ArtistRatingTemplate {
  overall: number;
  talent: number;
  performance: number;
  proffesionalism: number;
  stage_presence: number;
  charisma: number;
  timeliness: number;
  communication: number;
  respectfulness: number;
  total_rates: number;
}

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
  stats: {
    rating: ArtistRatingTemplate;
  };
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

  declare stats: {
    rating: ArtistRatingTemplate;
  };

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

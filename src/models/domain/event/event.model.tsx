import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate } from "~/models/base";
import { ArtistModel } from "../artist/artist.model";
import { PlaceModel } from "../place/place.model";

export interface EventTemplate extends EntityTemplate {
  verified_status: VerificationStatus;
  name: string;
  subtitle: string;
  photo: string;
  main_artist_id: string;
  main_artist: ArtistModel;
  guest_artist_id: string;
  guest_artist: ArtistModel;
  place_id: string;
  place?: PlaceModel;
  timetable__initial_date: string;
  timetable__end_date: string;
  timetable__openning_doors: string;
  timetable__guest_time: string;
  timetable__main_artist_time: string;
  promoter: string;
  national_code: string;
}

export class EventModel
  extends EntityModel<EventTemplate>
  implements EventTemplate
{
  declare name: string;
  declare verified_status: VerificationStatus;
  declare subtitle: string;
  declare photo: string;
  declare main_artist_id: string;
  declare main_artist: ArtistModel;
  declare guest_artist_id: string;
  declare guest_artist: ArtistModel;
  declare place_id: string;
  declare place?: PlaceModel;
  declare timetable__initial_date: string;
  declare timetable__end_date: string;
  declare timetable__openning_doors: string;
  declare timetable__guest_time: string;
  declare timetable__main_artist_time: string;
  declare promoter: string;
  declare national_code: string;

  public get cardInfo() {
    return { title: this.name, subtitle: this.timetable__initial_date };
  }
}

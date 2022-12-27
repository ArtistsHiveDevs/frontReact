import { VerificationStatus } from "~/constants";

export interface EventTemplate {
  id: string;
  verified_status: VerificationStatus;
  name: string;
  subtitle: string;
  photo: string;
  main_artist_id: string;
  guest_artist_id: string;
  place_id: string;
  timetable__initial_date: string;
  timetable__end_date: string;
  timetable__openning_doors: string;
  timetable__guest_time: string;
  timetable__main_artist_time: string;
  promoter: string;
  national_code: string;
}

export class EventModel implements EventTemplate {
  id: string;
  name: string;
  verified_status: VerificationStatus;
  subtitle: string;
  photo: string;
  main_artist_id: string;
  guest_artist_id: string;
  place_id: string;
  timetable__initial_date: string;
  timetable__end_date: string;
  timetable__openning_doors: string;
  timetable__guest_time: string;
  timetable__main_artist_time: string;
  promoter: string;
  national_code: string;

  constructor(private readonly template: EventTemplate) {
    this.id = template.id;
    this.verified_status = template.verified_status;
    this.name = template.name;
    this.subtitle = template.subtitle;
    this.photo = template.photo;
    this.main_artist_id = template.main_artist_id;
    this.guest_artist_id = template.guest_artist_id;
    this.place_id = template.place_id;
    this.timetable__initial_date = template.timetable__initial_date;
    this.timetable__end_date = template.timetable__end_date;
    this.timetable__openning_doors = template.timetable__openning_doors;
    this.timetable__guest_time = template.timetable__guest_time;
    this.timetable__main_artist_time = template.timetable__main_artist_time;
    this.promoter = template.promoter;
    this.national_code = template.national_code;
  }

  public get cardInfo() {
    return { title: this.name, subtitle: this.timetable__initial_date };
  }
}

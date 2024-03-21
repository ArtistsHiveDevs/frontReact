import moment from 'moment';
import { EntityModel, EntityTemplate, SearchableTemplate } from '~/models/base';
import { ArtistTemplate } from '~/models/domain/artist/artist.model';
import { EventTemplate } from '~/models/domain/event/event.model';
import { PlaceTemplate } from '~/models/domain/place/place.model';

export interface ProfilePictures {
  thumbnail: string;
  cover: string;
}

export interface TourOutlineProfilePicturesTemplate extends ProfilePictures {
  poster: string;
}

export interface TourOutlineSummaryTemplate {
  days: {
    initial_date: Date;
    final_date: Date;
  };
  countries: [
    {
      name: string;
      cities: string[];
    }
  ];

  budget?: {
    food?: number;
    transportation?: {
      internal_transportation?: {
        uber?: number;
        bike?: number;
        motorbike?: number;
        car?: number;
        car_rental?: number;
        public_transportation?: number;
        van?: number;
      };
      intercity_transportation?: {
        public_bus?: number;
        private_bus?: number;
        car?: number;
        car_rental?: number;
        flights?: number;
        boats?: number;
      };
    };
    accomodation?: {
      airbnb?: number;
      booking?: number;
      hotels?: number;
      house_rental?: number;
    };
  };
}

export interface TourOutlineTemplate extends EntityTemplate {
  name: string;
  subtitle: string;
  summary: TourOutlineSummaryTemplate;
  pictures: TourOutlineProfilePicturesTemplate;
  likedPlaces: PlaceTemplate[];
  likedArtists: ArtistTemplate[];
  events: EventTemplate[];
}

export class TourOutlineModel
  extends EntityModel<TourOutlineTemplate>
  implements TourOutlineTemplate, SearchableTemplate
{
  declare name: string;
  declare subtitle: string;
  declare summary: TourOutlineSummaryTemplate;
  declare pictures: TourOutlineProfilePicturesTemplate;
  declare likedPlaces: PlaceTemplate[];
  declare likedArtists: ArtistTemplate[];
  declare events: EventTemplate[];

  get totalDays() {
    return moment(this.summary.days.final_date).diff(moment(this.summary.days.initial_date), 'days');
  }
}

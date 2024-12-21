import { Dayjs } from 'dayjs';
import { VerificationStatus } from '~/constants';
import { ProfileModel, ProfileTemplate, SocialNetworkUsernamesTemplate } from '~/models/base';
import { CountryModel, CountryTemplate } from '~/models/parametrics/geo/country.model';
import { EventTemplate } from '../event/event.model';

export interface EnterpriseTemplate extends ProfileTemplate {
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic?: string;
  photo?: string;
  description: string;
  date?: Date;
  events: EventTemplate[];
  genres: { [artType: string]: string[] };

  since: Dayjs;
  home_city: string;
  country: CountryTemplate;
  city: any;
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

  social_networks_usernames: SocialNetworkUsernamesTemplate;
}

export class EnterpriseModel extends ProfileModel<EnterpriseTemplate> implements EnterpriseTemplate {
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

  declare since: Dayjs;
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

  declare social_networks_usernames: SocialNetworkUsernamesTemplate;

  declare country: CountryModel;
  declare city: any;

  constructor(template: EnterpriseTemplate) {
    super(template);
    this.social_networks_usernames = {
      website: template.website,
      email: template.email,
      mobile_phone: template.mobile_phone,
      whatsapp: template.whatsapp,
      facebook: template.facebook,
      instagram: template.instagram,
      spotify: template.spotify,
      youtube: template.youtube,
      youtube_widget_id: template.youtube_widget_id,
    };
  }

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.description;
  }
}

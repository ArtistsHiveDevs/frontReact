import { VerificationStatus } from '~/constants';
import { ProfileApprovalStatus } from '~/constants/domain/profile.constants';
import { LocationTemplate, Model, ProfileModel, ProfileTemplate, SearchableTemplate } from '~/models/base';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel, EventTemplate } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';

export interface DomainRole {
  entityName: string;
  label: string;
  roles: string[];
}

export interface EntityInstanceRoleMapTemplate {
  id: string;
  _id?: string;
  entity?: string;
  entityType?: string;
  roles?: string[];
  profile_pic?: string;
  name?: string;
  stage_name?: string;
  username?: string;
  shortId?: string;
  subtitle?: string;
  //TODO verificar si se puede quitar
  location?: string | LocationTemplate[];
  verified_status: VerificationStatus;
  approval_status?: ProfileApprovalStatus;
}
export interface UserAvailableEntityRole {
  entityName: string;
  entityRoleMap: EntityInstanceRoleMapTemplate[];
}

export interface UserPermissionsTemplate {
  canEdit: boolean;
  isInProfile: boolean;
}

export interface UserGenderTemplate {
  index: number;
  value: string;
}
export const UserGenders: UserGenderTemplate[] = [
  { index: 1, value: 'male' },
  { index: 2, value: 'female' },
  { index: 3, value: 'non_binary' },
  { index: 4, value: 'non_specified' },
];

export const APP_DOMAIN_ROLES: { [entityName: string]: DomainRole } = {
  ARTIST: {
    entityName: 'Artist',
    label: 'user_profile.artist',
    roles: [
      'ARTIST_OWNER',
      'ARTIST_MEMBER',
      'MANAGER',
      'ROADIE',
      'SOUND_ENGINEER',
      'LIGHTS_ENGINEER',
      'STAGE_ENGINEER',
      'SUBSTITUTE_ARTIST_MEMBER',
      'ARTIST_OWN_STAFF',
      'PHOTOGRAPHER',
      'VIDEOGRAPHER',
      'PRODUCER',
      'MEDIA_MANAGER',
      'TOUR_MANAGER',
    ],
  },
  PLACE: {
    entityName: 'Place',
    label: 'user_profile.place',
    roles: ['PLACE_OWNER', 'MANAGER', 'MEDIA_MANAGER', 'INFRASTRUCTURE_MANAGER'],
  },
};

export interface AppUserTemplate extends ProfileTemplate {
  sub: string;
  given_names: string;
  surnames: string;
  stage_name: string;
  username: string;
  email: string;
  password?: string;
  phone_number: string;
  access_token: string;
  gender?: number;
  blood_group?: string;
  agrees_to_a_blood_transfusion?: boolean;
  birthdate?: string;
  nationality?: string;
  home_city?: string;
  home_address?: string;
  latlng?: string;
  profile_pic?: string;
  verified_status?: VerificationStatus;
  user_language?: string;
  created_at?: string;
  updated_at?: string;

  roles: UserAvailableEntityRole[];
  currentProfileIdentifier: string;

  events_as_artist: {
    next_events: EventTemplate[];
    past_events: EventTemplate[];
  };
  subscribed_events: {
    next_events: EventTemplate[];
    past_events: EventTemplate[];
  };

  show_industry_member_banner: boolean;
  request_industry_member: number;

  // Se asigna manualmente en la base de datos por ahora; no hay endpoint/UI para setearlo (ver /admin/pending-profiles).
  is_platform_admin?: boolean;
}

export class AppUserModel extends ProfileModel<AppUserTemplate> implements AppUserTemplate, SearchableTemplate {
  membershipEntities = ['Artist', 'Place'];
  membershipEntitiesClassName = [ArtistModel.name, PlaceModel.name];

  declare sub: string;
  declare given_names: string;
  declare surnames: string;
  declare stage_name: string;
  declare username: string;
  declare email: string;
  declare password?: string;

  declare accessToken: string;

  declare phone_number: string;
  declare access_token: string;
  declare gender: number;
  declare blood_group: string;
  declare agrees_to_a_blood_transfusion?: boolean;

  declare birthdate: string;
  declare nationality: string;
  declare home_city: string;
  declare home_address: string;
  declare latlng: string;
  declare profile_pic: string;
  declare verified_status: VerificationStatus;
  declare user_language: string;
  declare created_at: string;
  declare updated_at: string;

  declare roles: UserAvailableEntityRole[];
  declare currentProfileIdentifier: string;

  declare events_as_artist: {
    next_events: EventTemplate[];
    past_events: EventTemplate[];
  };
  declare subscribed_events: {
    next_events: EventTemplate[];
    past_events: EventTemplate[];
  };

  declare show_industry_member_banner: boolean;
  declare request_industry_member: number;

  declare is_platform_admin?: boolean;

  artistMemberships: CurrentProfileInfoModel[];
  placeMemberships: CurrentProfileInfoModel[];

  constructor(template: AppUserTemplate) {
    super(template);

    this.membershipEntities.forEach((entityName: string, index: number) => {
      const availableEntity = this.roles?.find((role: UserAvailableEntityRole) => role.entityName === entityName);
      if (availableEntity) {
        availableEntity.entityRoleMap = availableEntity?.entityRoleMap.map(
          (roleMapInstance) =>
            new CurrentProfileInfoModel({ ...roleMapInstance, entity: this.membershipEntitiesClassName[index] })
        );
      }
      const getRoleMap = () => (availableEntity ? [...availableEntity.entityRoleMap] : []);

      // TODO camelCase
      this.buildAttribute(
        `${entityName.toLowerCase()}Memberships`,
        template,
        undefined,
        undefined,
        undefined,
        getRoleMap
      );
    });
    this.currentProfileIdentifier = template.currentProfileIdentifier || this.identifier;

    // Events
    const eventSubscriptions = ['events_as_artist', 'subscribed_events'];
    eventSubscriptions.forEach((subscription) => {
      if (subscription) {
        const subscriptionTemplate = template[subscription as keyof AppUserTemplate];
        if (subscriptionTemplate) {
          Object.keys(subscriptionTemplate).forEach((eventsType) => {
            const events: any[] = subscriptionTemplate[eventsType as keyof typeof subscriptionTemplate] || [];
            this[subscription as keyof AppUserModel][eventsType] =
              events?.map((event: EventTemplate) => new EventModel(event)) || [];
          });
        }
      }
    });
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.username && !!this.nameKnownAs && !!this.email;
  }

  get hasFilledProfile(): boolean {
    return !!this.nameKnownAs.trim().length && !!this.gender; //&& !!this.nationality;
  }

  get fullname() {
    return `${this.given_names || ''} ${this.surnames || ''}`.trim();
  }

  get genderEnum(): UserGenderTemplate {
    return UserGenders.find((gender) => gender.index === this.gender);
  }

  get nameKnownAs() {
    return this.stage_name || this.fullname;
  }

  get subtitle(): string {
    return null;
  }

  get currentProfileInfo(): CurrentProfileInfoModel {
    let template;
    template = {
      entity: AppUserModel.name,
      id: this.identifier,
      name: this.nameKnownAs,
      username: this.username,
      profile_pic: this.profile_pic,
      subtitle: this.subtitle,
      verified_status: this.verified_status,
      roles: ['OWNER'],
    };

    if (this.currentProfileIdentifier !== this.identifier) {
      const profiles = this.roles.find((role) =>
        role.entityRoleMap.find((roleMap) => [roleMap.id, roleMap.username].includes(this.currentProfileIdentifier))
      );

      const newTemplate = profiles?.entityRoleMap.find((roleMap) =>
        [roleMap.id, roleMap.username].includes(this.currentProfileIdentifier)
      );

      template = newTemplate || template;
    }

    return new CurrentProfileInfoModel(template);
  }

  get isInPersonalProfile() {
    // return this.currentProfileInfo?.identifier !== this?.identifier;
    return this.currentProfileIdentifier === this?.identifier;
  }

  // Comparan por `id` (el _id de Mongo cacheado en roles[].entityRoleMap[], que nunca cambia) en vez de
  // por `.entity`/`.identifier`: estos últimos dependen de que el username cacheado esté sincronizado con
  // el de la entidad viva, cosa que hoy no ocurre para Place cuando se edita después de creado.
  get isArtistProfile(): boolean {
    const currentId = this.currentProfileInfo?.id;
    return !!currentId && this.artistMemberships.some((membership) => membership.id === currentId);
  }

  get isPlaceProfile(): boolean {
    const currentId = this.currentProfileInfo?.id;
    return !!currentId && this.placeMemberships.some((membership) => membership.id === currentId);
  }

  get hasIndustryProfiles() {
    return !!this.roles.find(
      (role: UserAvailableEntityRole) =>
        this.membershipEntities.includes(role.entityName) && !!role.entityRoleMap.length
    );
  }

  get isIndustryMember() {
    return !!this.roles && !!this.roles.length;
  }

  checkPermissions(idResource: string): UserPermissionsTemplate {
    const flattenIds = (roles: any[]): string[] => {
      return roles.flatMap(
        (role) =>
          role.entityRoleMap
            .flatMap((entityRole: any) => [entityRole.id, entityRole.username, entityRole.shortId])
            .filter((value: any) => value !== undefined && value !== null) // Filtra valores no definidos o nulos
      );
    };

    const ids = flattenIds(this.roles || []);
    if (this.id) {
      ids.push(this.id);
    }
    if (this.username) {
      ids.push(this.username);
    }
    if (this.shortId) {
      ids.push(this.shortId);
    }

    return { canEdit: ids.includes(idResource), isInProfile: idResource === this.currentProfileIdentifier };
    return {
      canEdit: ids.includes(idResource),
      isInProfile: !this.currentProfileIdentifier || idResource === this.currentProfileIdentifier,
    };
  }

  getMembershipsByEntity(entityType: string): CurrentProfileInfoModel[] {
    let entityName = undefined;
    let path = undefined;
    if (entityType === 'artists') {
      entityName = 'Artist';
      path = ArtistModel.name;
    } else if (entityType === 'places') {
      entityName = 'Place';
      path = PlaceModel.name;
    } else if (entityType === 'events') {
      entityName = 'Event';
      path = EventModel.name;
    }
    return (this.roles.find((role) => role.entityName === entityName)?.entityRoleMap || []).map(
      (roleMapInstance) => new CurrentProfileInfoModel({ ...roleMapInstance, entity: path })
    );
  }

  currentSessionLikesProfile(element: ProfileModel<any>) {
    console.log('LIKES????? ', element.followed_by, this.currentProfileInfo);
    return !!(element?.followed_by || []).find((e: any) => e.entityId === this.currentProfileInfo.id);
  }
}

export class CurrentProfileInfoModel
  extends Model<EntityInstanceRoleMapTemplate>
  implements EntityInstanceRoleMapTemplate, SearchableTemplate
{
  declare entity: string;
  declare id: string;
  declare name: string;
  declare given_names?: string;
  declare surnames?: string;
  declare stage_name?: string;
  declare username?: string;
  declare shortId?: string;
  declare profile_pic?: string;
  declare subtitle?: string;
  declare verified_status: VerificationStatus;
  declare approval_status?: ProfileApprovalStatus;
  declare roles?: string[];
  declare location?: string | LocationTemplate[];

  constructor(template: EntityInstanceRoleMapTemplate) {
    super(template);
    this.entity = template.entity || template.entityType;
    this.id = template.id || template._id;
  }

  get identifier() {
    return this.username || this.shortId || this.id;
  }

  async avatarURL(): Promise<string> {
    return await this.getS3UrlWithCache(this.profile_pic);
  }

  get cityWithCountry() {
    if (this.location && Array.isArray(this.location)) {
      const locationObj = this.location[0]; // Si location es un array, tomamos el primer objeto
      return [
        locationObj.city,
        locationObj.state,
        locationObj.country_name, // Accedemos a country_name (en lugar de `country.location.name` ya que location es el objeto que contiene la propiedad country_name)
      ]
        .filter(Boolean)
        .join(', ');
    }

    // Si no se puede obtener los datos, retornamos null
    return null;
  }

  get hasFetchAllData(): boolean {
    return !!this.id;
  }

  get fullname() {
    return `${this.given_names || ''} ${this.surnames || ''}`.trim();
  }

  get nameKnownAs() {
    return this.stage_name || this.fullname || this.name;
  }
}

export const UNLOGGED_USER: AppUserModel = undefined;

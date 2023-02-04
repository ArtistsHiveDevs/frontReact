import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate, SearchableTemplate } from "~/models/base";

export interface DomainRole {
  entityName: string;
  label: string;
  roles: string[];
}

export interface UserEntityRoleMap {
  id: string;
  roles: string[];
}
export interface UserAvailableEntityRole {
  entityName: string;
  entityRoleMap: UserEntityRoleMap[];
}

export const APP_DOMAIN_ROLES: { [entityName: string]: DomainRole } = {
  ARTIST: {
    entityName: "Artist",
    label: "user_profile.artist",
    roles: [
      "ARTIST_OWNER",
      "ARTIST_MEMBER",
      "MANAGER",
      "ROADIE",
      "SOUND_ENGINEER",
      "LIGHTS_ENGINEER",
      "STAGE_ENGINEER",
      "SUBSTITUTE_ARTIST_MEMBER",
      "ARTIST_OWN_STAFF",
      "PHOTOGRAPHER",
      "VIDEOGRAPHER",
      "PRODUCER",
      "MEDIA_MANAGER",
      "TOUR_MANAGER",
    ],
  },
  PLACE: {
    entityName: "Place",
    label: "user_profile.place",
    roles: [
      "PLACE_OWNER",
      "MANAGER",
      "MEDIA_MANAGER",
      "INFRASTRUCTURE_MANAGER",
    ],
  },
};

export interface AppUserTemplate extends EntityTemplate {
  given_names: string;
  surnames: string;
  artistic_name: string;
  username: string;
  email: string;
  password?: string;
  phone_number: string;
  access_token: string;
  gender?: number;
  blood_group?: string;
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
}

export class AppUserModel
  extends EntityModel<AppUserTemplate>
  implements AppUserTemplate, SearchableTemplate
{
  declare given_names: string;
  declare surnames: string;
  declare artistic_name: string;
  declare username: string;
  declare email: string;
  declare password?: string;

  declare accessToken: string;

  declare phone_number: string;
  declare access_token: string;
  declare gender: number;
  declare blood_group: string;
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

  constructor(template: AppUserTemplate) {
    super(template);

    const membershipEntities = ["Artist", "Place"];

    membershipEntities.forEach((entityName: string) => {
      const roleMap =
        (this.roles &&
          this.roles.length &&
          this.roles.find(
            (role: UserAvailableEntityRole) => role.entityName === entityName
          )?.entityRoleMap) ||
        [];

      const getRoleMap = () => [...roleMap];

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
  }

  get fullname() {
    return `${this.given_names} ${this.surnames}`;
  }

  get name() {
    return this.artistic_name || this.fullname;
  }

  get subtitle(): string {
    return null;
  }

  modifyDummyRole(
    entity: string,
    idEntity: string,
    roleName: string,
    action: "add" | "del"
  ) {
    // Busca la entidad en la que se va modificar el rol
    if (!this.roles.find((role) => role.entityName === entity)) {
      this.roles.push({ entityName: entity, entityRoleMap: [] });
    }
    const role = this.roles.find((role) => role.entityName === entity);

    // Busca la instancia de la entidad
    if (!role.entityRoleMap.find((roleMap) => roleMap.id === idEntity)) {
      role.entityRoleMap.push({ id: idEntity, roles: [] });
    }
    const roleMap = role.entityRoleMap.find(
      (roleMap) => roleMap.id === idEntity
    );

    // Revisa si existe el rol en esa instancia
    const exists = roleMap.roles.includes(roleName);
    if (action === "add") {
      if (!exists) {
        roleMap.roles.push(roleName);
      }
    } else if (action === "del") {
      if (exists) {
        // Elimina el rol de la instancia
        roleMap.roles = roleMap.roles.filter((role) => role !== roleName);

        if (!roleMap.roles.length) {
          // Si la instancia no tiene más roles, se elimina
          role.entityRoleMap = role.entityRoleMap.filter(
            (roleMap) => roleMap.roles.length
          );
        }

        if (!role.entityRoleMap.length) {
          // Si el usuario no tiene instancias, elimina la entidad
          this.roles = this.roles.filter(
            (entityRoles) => entityRoles.entityRoleMap.length
          );
        }
      }
    }
  }
}

export const UNLOGGED_USER: AppUserModel = undefined;

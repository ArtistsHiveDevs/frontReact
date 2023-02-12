import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate, SearchableTemplate } from "~/models/base";

export interface DomainRole {
  entityName: string;
  label: string;
  roles: string[];
}

export interface UserEntityRoleMap {
  entityId: string;
  roles: string[];
}
export interface UserAvailableEntityRole {
  entityName: string;
  entityRoleMap: UserEntityRoleMap[];
}

export const APP_DOMAIN_ROLES: { [entityName: string]: DomainRole } = {
  ARTIST: {
    entityName: "ARTIST",
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
    entityName: "PLACE",
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
  roles: UserAvailableEntityRole[];
  phone_number: string;
  profile_pic?: string;
  verified_status?: VerificationStatus;
  user_language?: string;
  created_at?: string;
  updated_at?: string;

  accessToken: string;
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
  declare roles: UserAvailableEntityRole[];
  declare phone_number: string;
  declare profile_pic?: string;
  declare verified_status?: VerificationStatus;
  declare user_language?: string;
  declare created_at?: string;
  declare updated_at?: string;

  declare accessToken: string;

  constructor(template: AppUserTemplate) {
    super(template);

    this.roles = [];
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
    if (!role.entityRoleMap.find((roleMap) => roleMap.entityId === idEntity)) {
      role.entityRoleMap.push({ entityId: idEntity, roles: [] });
    }
    const roleMap = role.entityRoleMap.find(
      (roleMap) => roleMap.entityId === idEntity
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

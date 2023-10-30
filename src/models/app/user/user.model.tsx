import { EntityModel, EntityTemplate } from "~/models/base";

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

export const APP_DOMAIN_ROLES: { [entityName: string]: DomainRole } = {};

export interface AppUserTemplate extends EntityTemplate {
  given_names: string;
  surnames: string;
  username: string;
  email: string;
  password?: string;
  roles: UserAvailableEntityRole[];
  phone_number: string;

  accessToken: string;
}

export class AppUserModel
  extends EntityModel<AppUserTemplate>
  implements AppUserTemplate
{
  declare given_names: string;
  declare surnames: string;
  declare username: string;
  declare email: string;
  declare password?: string;
  declare roles: UserAvailableEntityRole[];
  declare phone_number: string;

  declare accessToken: string;

  constructor(template: AppUserTemplate) {
    super(template);

    this.roles = [];
  }

  get fullname() {
    return `${this.given_names} ${this.surnames}`;
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

import "./index.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useArtistsSlice } from "~/common/slices";
import { selectArtists } from "~/common/slices/artists/selectors";
import { usePlacesSlice } from "~/common/slices/places";
import { selectPlaces } from "~/common/slices/places/selectors";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import {
  AppUserModel,
  APP_DOMAIN_ROLES,
  DomainRole,
  UNLOGGED_USER,
  UserAvailableEntityRole,
  UserEntityRoleMap,
} from "~/models/app/user/user.model";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { PlaceModel } from "~/models/domain/place/place.model";

import Form from "react-bootstrap/Form";
import { FloatingLabel } from "react-bootstrap";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import { EntityModel, EntityTemplate } from "~/models/base";
import { crearDummyUser } from "./dummy-users.mock";

const AppSettingsPage = () => {
  const { auth, setAuth } = useAuth();

  const [selectedUser, setSelectedUser] = useState<AppUserModel>(UNLOGGED_USER);
  const [selectedArtistsId, setSelectedArtistId] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const placesList: PlaceModel[] = useSelector(selectPlaces);
  const { actions: placesActions } = usePlacesSlice();

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    if (artistList.length === 0) {
      dispatch(artistsActions.loadArtists());
    }

    if (placesList.length === 0) {
      dispatch(placesActions.loadPlaces());
    }

    setSelectedUser(auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAuth(selectedUser);
  }, [selectedUser]);

  function setLoggedUser(numUsuario: number) {
    if (numUsuario > 0) {
      setSelectedUser(crearDummyUser(numUsuario));
    } else {
      setSelectedUser(UNLOGGED_USER);
    }
  }

  const artistsOptions: SelectOptionType[] = [
    { value: "", label: "Ninguno" },
    ...artistList.map((artist) => {
      return { value: artist.id, label: artist.name };
    }),
  ];

  const placesOptions: SelectOptionType[] = [
    { value: "", label: "Ninguno" },
    ...placesList.map((place) => {
      return { value: place.id, label: place.name };
    }),
  ];

  const shownFields = ["username", "fullname", "email"];
  const keys = !selectedUser
    ? []
    : [...listGetters(selectedUser), ...Object.keys(selectedUser)];
  const userAttributes: IconDetailedAttribute[] = !selectedUser
    ? []
    : shownFields
        .filter((key) => keys.find((shownKey) => shownKey === key))
        .map((foundKey) => {
          return {
            name: foundKey,
            value: selectedUser[foundKey as keyof AppUserModel],
            title: foundKey,
          };
        });

  function listGetters(instance: any) {
    return Object.entries(
      Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(instance))
    )
      .filter((e) => typeof e[1].get === "function" && e[0] !== "__proto__")
      .map((e) => e[0]);
  }

  function handleClickRole(
    entityName: string,
    entityId: string,
    roleName: string,
    action: "add" | "del"
  ) {
    auth?.modifyDummyRole(entityName, entityId, roleName, action);
    const updated = new AppUserModel(auth?.template);
    updated.roles = auth?.roles || [];

    setSelectedUser(updated);
  }

  const usuarios = [1, 2, 3, 4, 5];
  return (
    <>
      <h2>Settings</h2>
      <h3>Perfil de usuario </h3>
      <p>
        {usuarios.map((numeroUsuario) => {
          return (
            <>
              <span onClick={() => setLoggedUser(numeroUsuario)}>
                Usuario {numeroUsuario}
              </span>
              {" | "}
            </>
          );
        })}
        <span onClick={() => setLoggedUser(0)}>Cerrar sesión</span>
      </p>
      <p>Usuario loggeado:</p>

      {!selectedUser && <p>No hay un usuario</p>}
      {selectedUser && (
        <div className="logged-user-box">
          <h5>User info:</h5>
          <AttributesIconFieldReadOnly attributes={userAttributes} />
          <h5>Roles:</h5>
          {Object.keys(APP_DOMAIN_ROLES).map((roleKeyName, index) => {
            const roleConfig: DomainRole = APP_DOMAIN_ROLES[roleKeyName];

            let lista: any[] = [];
            if (roleConfig.entityName === "ARTIST") {
              lista = artistList;
            } else if (roleConfig.entityName === "PLACE") {
              lista = placesList;
            }

            const roles = selectedUser?.roles || [];
            return roles
              .filter(
                (userRoleEntity) =>
                  userRoleEntity.entityName === roleConfig.entityName
              )
              .map((availableEntity: UserAvailableEntityRole) => {
                const instances: UserEntityRoleMap[] =
                  availableEntity.entityRoleMap;

                return (
                  <EntityRoles
                    key={`${roleConfig}-${index}`}
                    roleConfig={roleConfig}
                    instances={instances}
                    dataSource={lista}
                    handleClickRole={handleClickRole}
                  />
                );
              });
          })}
        </div>
      )}
    </>
  );
};

export const EntityRoles = (props: any) => {
  const { roleConfig, instances, dataSource, handleClickRole } = props;
  return (
    <div>
      <h6>{roleConfig.label}</h6>
      {instances
        .filter((instance: UserEntityRoleMap) => !!instance.roles.length)
        .map((instance: UserEntityRoleMap, instanceIndex: number) => {
          const userRoles = instance.roles;
          return (
            <EntityInstanceRole
              key={`${instance.entityId}-${instanceIndex}`}
              entityInstanceName={
                dataSource.find(
                  (element: EntityModel<EntityTemplate>) =>
                    element.id === instance.entityId
                ).name
              }
              entityName={roleConfig.entityName}
              entityId={instance.entityId}
              roles={userRoles}
              handleClickRole={handleClickRole}
            />
          );
        })}
    </div>
  );
};
export const EntityInstanceRole = (props: any) => {
  const { entityName, entityId, entityInstanceName, roles, handleClickRole } =
    props;
  return (
    <div>
      <p>{entityInstanceName}</p>
      <div className="role-names-container">
        {roles.map((roleName: string, roleIndex: number) => {
          return (
            <UserRoleName
              key={`${roleName}-${roleIndex}`}
              entityName={entityName}
              entityId={entityId}
              roleName={roleName}
              handleClickRole={handleClickRole}
            />
          );
        })}
      </div>
    </div>
  );
};

export const UserRoleName = (props: any) => {
  const { entityName, entityId, roleName, handleClickRole } = props;
  return (
    <div className="user-role-name">
      <span>{roleName}</span>
      <span
        className="user-role-delete-button"
        onClick={() => handleClickRole(entityName, entityId, roleName, "del")}
      >
        {" "}
        X{" "}
      </span>{" "}
    </div>
  );
};
export interface SelectOptionType {
  value: string;
  label: string;
}
export const FormSelectComponent = (props: any) => {
  const { label, options } = props || {};

  function handleSelection(event: any) {
    console.log("SEleccionadno ", event.target.value);
  }
  return (
    <FloatingLabel
      style={{ width: "100%" }}
      controlId="floatingSelect"
      label={label}
    >
      <Form.Select
        aria-label="Default select example"
        onChange={handleSelection}
      >
        {options.map((option: SelectOptionType) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </Form.Select>
    </FloatingLabel>
  );
};

const EntityRolesForm = (props: any) => {
  const { entityName, options } = props;
  return (
    <>
      <h4>Agregar {entityName}</h4>
      <FormSelectComponent
        label={`Seleccione un ${entityName}`}
        options={options}
      />
    </>
  );
};
export default AppSettingsPage;

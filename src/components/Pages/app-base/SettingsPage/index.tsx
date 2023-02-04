import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useArtistsSlice } from "~/common/slices";
import { selectArtists } from "~/common/slices/artists/selectors";
import { usePlacesSlice } from "~/common/slices/places";
import { selectPlaces } from "~/common/slices/places/selectors";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import {
  APP_DOMAIN_ROLES,
  AppUserModel,
  DomainRole,
  UNLOGGED_USER,
  UserAvailableEntityRole,
  UserEntityRoleMap,
} from "~/models/app/user/user.model";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import "./index.scss";

import { FloatingLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { HvAppContext } from "~/common";
import { useUsersSlice } from "~/common/slices/users";
import { selectUsers } from "~/common/slices/users/selectors";
import { useI18n } from "~/common/utils";
import { ProfilePicture } from "~/components/shared/atoms/gui/ProfilePicture/ProfilePicture";
import { DynamicIcons } from "~/components/shared/DynamicIcons";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import { EntityModel, EntityTemplate } from "~/models/base";
import { AVAILABLE_I18N_LANGUAGES } from "~/translations";

const TRANSLATION_BASE_SETTINGS_PAGE = "app.pages.app.settings";

const AppSettingsPage = () => {
  const { loggedUser, setLoggedUser } = useAuth();

  const [selectedUser, setSelectedUser] = useState<AppUserModel>(UNLOGGED_USER);
  const [selectedArtistsId, setSelectedArtistId] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const placesList: PlaceModel[] = useSelector(selectPlaces);
  const { actions: placesActions } = usePlacesSlice();

  const usersList: AppUserModel[] = useSelector(selectUsers);
  const { actions: usersActions } = useUsersSlice();

  // Hooks
  const dispatch = useDispatch();
  const { translateText, locale } = useI18n();
  let { lang, messages, setLocale } = useContext(HvAppContext);

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SETTINGS_PAGE}.${text}`);
  }

  // Effects
  useEffect(() => {
    if (artistList.length === 0) {
      dispatch(artistsActions.loadArtists());
    }

    if (placesList.length === 0) {
      dispatch(placesActions.loadPlaces());
    }

    dispatch(usersActions.loadUsers());

    setSelectedUser(loggedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoggedUser(selectedUser);
  }, [selectedUser]);

  function setCurrentUser(user: AppUserModel) {
    if (user) {
      setSelectedUser(user);
      setLocale(user.user_language);
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

  const shownFields = ["username", "name", "fullname", "email"];
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
    id: string,
    roleName: string,
    action: "add" | "del"
  ) {
    loggedUser?.modifyDummyRole(entityName, id, roleName, action);
    const updated = new AppUserModel(loggedUser?.template);
    updated.roles = loggedUser?.roles || [];

    setSelectedUser(updated);
  }

  return (
    <>
      <h2>{translate("title")}</h2>
      <h3>
        <DynamicIcons iconName="FaGlobeAmericas" size={20} />{" "}
        {translate("language_selection.title")}{" "}
      </h3>
      <p>
        {AVAILABLE_I18N_LANGUAGES.map((newLang, index, newLangArr) => {
          const styles = [];
          if (newLang === lang) {
            styles.push("active-lang");
          }
          return (
            <span key={`lang-${index}`}>
              <span
                className={styles.join(" ")}
                onClick={() => setLocale(newLang)}
              >
                {newLang}
              </span>
              {index < newLangArr.length - 1 && "  |  "}
            </span>
          );
        })}
      </p>
      <h3>
        <DynamicIcons iconName="FaUserAstronaut" size={20} />
        {translate("user_profile.title")}{" "}
      </h3>
      <p>
        {usersList.map((user) => {
          const styles = [];
          if (`${user.id}` === selectedUser?.id) {
            styles.push("active-lang");
          }
          return (
            <span key={`user_${user.id}`}>
              <span
                className={styles.join(" ")}
                onClick={() => setCurrentUser(user)}
              >
                {user.name}
              </span>
              {" | "}
            </span>
          );
        })}
        <span onClick={() => setCurrentUser(UNLOGGED_USER)}>
          {translate("user_profile.logout")}
        </span>
      </p>
      <p>{translate("user_profile.logged_user")}:</p>

      {!selectedUser && <p>{translate("user_profile.empty_user")}</p>}
      {selectedUser && (
        <div className="logged-user-box">
          <h5>{translate("user_profile.user_info")}:</h5>
          <div className="logged-user-info">
            <ProfilePicture src={selectedUser.profile_pic} />
            <div>
              <AttributesIconFieldReadOnly
                attributes={userAttributes}
                className="logged-user-info-data"
              />
            </div>
          </div>
          <h5>{translate("user_profile.roles")}:</h5>
          {Object.keys(APP_DOMAIN_ROLES).map((roleKeyName, index) => {
            const roleConfig: DomainRole = APP_DOMAIN_ROLES[roleKeyName];

            let lista: any[] = [];
            if (roleConfig.entityName === "Artist") {
              lista = artistList;
            } else if (roleConfig.entityName === "Place") {
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

  const { translateText } = useI18n();
  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SETTINGS_PAGE}.${text}`);
  }
  return (
    <div>
      <h6>{translate(roleConfig.label)}</h6>
      {instances
        .filter((instance: UserEntityRoleMap) => !!instance.roles.length)
        .map((instance: UserEntityRoleMap, instanceIndex: number) => {
          const userRoles = instance.roles;
          return (
            <EntityInstanceRole
              key={`${instance.id}-${instanceIndex}`}
              entityInstanceName={
                dataSource?.find(
                  (element: EntityModel<EntityTemplate>) =>
                    element.id === instance.id
                )?.name
              }
              entityName={roleConfig.entityName}
              id={instance.id}
              roles={userRoles}
              handleClickRole={handleClickRole}
            />
          );
        })}
    </div>
  );
};
export const EntityInstanceRole = (props: any) => {
  const { entityName, id, entityInstanceName, roles, handleClickRole } = props;
  return (
    <div>
      <p>{entityInstanceName}</p>
      <div className="role-names-container">
        {roles.map((roleName: string, roleIndex: number) => {
          return (
            <UserRoleName
              key={`${roleName}-${roleIndex}`}
              entityName={entityName}
              id={id}
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
  const { entityName, id, roleName, handleClickRole } = props;
  return (
    <div className="user-role-name">
      <span>{roleName}</span>
      <span
        className="user-role-delete-button"
        onClick={() => handleClickRole(entityName, id, roleName, "del")}
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

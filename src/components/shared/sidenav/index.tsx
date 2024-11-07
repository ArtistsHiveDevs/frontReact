import { signOut } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { Container, Navbar, Offcanvas } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { resolveNavigateToEntityPath } from '~/common/utils/hooks/navigation/navigateToEntityResolver';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import { SearchComponent } from '~/components/shared/search';
import { PATHS, SUB_PATHS } from '~/constants';
import { AVAILABLE_ENTITY_MEMBERSHIPS } from '~/constants/app.constants';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { SearchableTemplate } from '~/models/base';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { ProfilePicture } from '../atoms/gui/ProfilePicture/ProfilePicture';
import './index.scss';
import { SIDENAV_MENU_CONFIG, SideMenuItem } from './sidenav.config';

const TRANSLATION_BASE_SIDENAV = 'app.appbase.sidenav';

const SideNav = () => {
  const loggedUser = useSelector(selectCurrentUser);

  const [show, setShow] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [openStatusSearchInputText, setOpenStatusSearchInputText] = useState(false);
  const [profilePicturesURLs, setProfilePicturesURLs] = useState<{ [profileIdentifier: string]: string }>({});
  const { navigateToEntity, navigateToInnerPath } = useNavigation();
  const { translateText, translateGlobalDict } = useI18n();
  const dispatch = useDispatch();

  const { actions: usersActions } = useUsersSlice();
  const handleClose = () => {
    setShow(false);
    setShowRight(false); // Asegurarte de cerrar ambos Offcanvas
  };
  const handleShow = () => setShow(true);
  const showHideSearchField = (event: any) => {
    setOpenStatusSearchInputText(!openStatusSearchInputText);
  };
  const navigateTo = (path: string, useRandomId = false) => {
    let paramId = '';
    if (useRandomId) {
      paramId = `${Math.floor(Math.random() * 18) + 1}`;
    }
    if (path) {
      navigateToInnerPath({ path: `${path}/${paramId}` });
    } else {
      navigateToInnerPath({ path: `` });
    }
    setShow(false);
    setShowRight(false);
  };

  const liMenuElement = (section: any, note: any, idx: number, level = 0) => {
    return (
      <RequireAuthComponent
        allowedRoles={note.allowedRoles}
        requiredSession={note.requireSession}
        name={note.name}
        key={idx}
      >
        <a
          className="menu-option"
          href={void 0}
          onClick={() => {
            if (note?.path) {
              navigateTo(note?.path, note.randomId);
            } else if (note?.handler && Object.keys(handlers).includes(note?.handler)) {
              handlers[note?.handler]();
            }
          }}
          style={{ paddingLeft: `${level * 3}rem` }}
        >
          <DynamicIcons iconName={note.icon || 'AiFillFile'} size={20} />
          <span className="menu-option-label">{translateText(note.name)}</span>
        </a>
        {note.nestedMenuOptions &&
          note.nestedMenuOptions.length &&
          note.nestedMenuOptions.map((childOption: any, index: number) =>
            liMenuElement(section, childOption, index, level + 1)
          )}
      </RequireAuthComponent>
    );
  };

  const handlers: { [handler: string]: Function } = {
    logout: async () => {
      await signOut();
      dispatch(usersActions.logout());
      setOpenStatusSearchInputText(false);
      handleClose();
    },
  };

  const handleResultOnClick = (element: SearchableTemplate) => {
    setOpenStatusSearchInputText(false);
    handleClose();
    let entityName = element.constructor.name;
    if (element instanceof CurrentProfileInfoModel) {
      entityName = element.entity;
    }
    navigateToEntity({ entityType: entityName, id: element.identifier });
  };

  const goToHome = () => navigateTo(PATHS.HOME);

  const userID = getStoredUserIdToken();

  const switchProfile = (element: SearchableTemplate) => {
    handleClose();
    dispatch(usersActions.switchProfile({ id: element.identifier }));
  };

  const getProfilePicURLs = async () => {
    if (!!loggedUser) {
      const urlsObject: { [identifier: string]: string } = {};
      urlsObject[loggedUser.identifier] = await loggedUser.avatarURL();
      loggedUser.artistMemberships.forEach(
        async (artistProfile) => (urlsObject[artistProfile.identifier] = await artistProfile.avatarURL())
      );
      loggedUser.placeMemberships.forEach(
        async (placeProfile) => (urlsObject[placeProfile.identifier] = await placeProfile.avatarURL())
      );
      setProfilePicturesURLs(urlsObject);
    }
  };

  useEffect(() => {
    if (!!loggedUser) {
      getProfilePicURLs();
    }
  }, [loggedUser]);

  const createNewEntityInstance = (entityType: string) => {
    if (!!loggedUser) {
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

      navigateToInnerPath({
        path: `${resolveNavigateToEntityPath(path)}/${SUB_PATHS.CREATE}`,
        options: { replace: true },
      });
      setShowRight(false);
    }
  };

  const createAgent = () => {
    navigateToInnerPath({
      path: `${PATHS.INDUSTRY}`,
      options: { replace: true },
    });
    setShowRight(false);
  };
  return (
    <>
      <Navbar className="toolbar-header mb-3" expand="true">
        <Container fluid>
          <div className="nav-menu-opt">
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand`} className="icon-burger" onClick={handleShow} />
            <a onClick={goToHome}>
              <img alt="Artist Hive" className="img-logotipo" src={import.meta.env.VITE_LOGO_URL} width="100" />
            </a>
          </div>

          <div className="nav-search-opt">
            <SearchComponent openedStatus={openStatusSearchInputText} onClick={handleResultOnClick} />
          </div>

          <div className="nav-login-opt">
            <span onClick={showHideSearchField}>
              {openStatusSearchInputText && <DynamicIcons iconName={'MdSearchOff'} size={32} />}
              {!openStatusSearchInputText && <DynamicIcons iconName={'AiOutlineSearch'} size={32} />}
            </span>
            {userID && (
              <ProfilePicture
                src={profilePicturesURLs[loggedUser?.currentProfileInfo?.identifier]}
                onClickHandler={() => {
                  console.log(loggedUser);
                  if (loggedUser.isIndustryMember) {
                    setShowRight(true); // Mostrar el Offcanvas derecho
                  } else {
                    handleResultOnClick(loggedUser?.currentProfileInfo);
                  }
                }}
                size="xs"
              />
            )}
            {!userID && (
              <a className="brand-text" onClick={() => navigateToInnerPath({ path: PATHS.LOGIN })}>
                Log in
              </a>
            )}
          </div>

          {!!show && (
            <Navbar.Offcanvas placement="start" show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton className="sidebar-header" closeVariant="white">
                <a onClick={goToHome}>
                  <img alt="Artist Hive" className="img-logotipo" src={import.meta.env.VITE_LOGO_URL} width="100" />
                </a>
                <h4 className="menu-title">{translateText(`${TRANSLATION_BASE_SIDENAV}.name`)}</h4>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <hr />
                {SIDENAV_MENU_CONFIG.map((sidenavSection, index) => {
                  const sectionOptions = sidenavSection.options || [];
                  return (
                    <RequireAuthComponent
                      key={`${sidenavSection.name}-${index}`}
                      allowedRoles={sidenavSection.allowedRoles}
                      requiredSession={sidenavSection.requireSession}
                      name={sidenavSection.name}
                    >
                      <div>
                        <section className="general-sec">
                          <h5 className="sec-general-label">{translateText(sidenavSection.name)}</h5>
                          <div className="option-menu-list">
                            {sectionOptions.map((option: SideMenuItem, idx) => {
                              return liMenuElement('general', option, idx);
                            })}
                          </div>
                        </section>
                        <hr />
                      </div>
                    </RequireAuthComponent>
                  );
                })}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          )}
          {!!showRight && (
            <Navbar.Offcanvas placement="end" show={showRight} onHide={handleClose} className={'w-75 mb-5'}>
              <Offcanvas.Header
                closeButton
                className="sidebar-header"
                closeVariant="white"
                onClick={() => handleResultOnClick(loggedUser)}
              >
                <div
                  className={[
                    'profile-header',
                    // loggedUser?.checkPermissions(loggedUser?.currentProfileInfo.identifier).isInProfile
                    //   ? 'current-profile'
                    //   : '',
                  ].join(' ')}
                >
                  <AvatarWithIcon
                    name=""
                    image={profilePicturesURLs[loggedUser?.identifier]}
                    avatarSize={'3.5rem'}
                    buttonIcon={!loggedUser?.checkPermissions(loggedUser?.identifier).isInProfile && 'PiUserSwitch'}
                    onClick={() => handleResultOnClick(loggedUser)}
                    onBadgeClick={() => switchProfile(loggedUser)}
                  />
                  <div className="profile-header-name">
                    <h4>{loggedUser?.stage_name || loggedUser?.given_names}</h4>
                    <p>@{loggedUser?.username}</p>
                  </div>
                </div>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div>
                  <section className="general-sec">
                    <div className="entity-row-container">
                      <h5 className="label">Agregar artista / agente</h5>
                      <div className="icon" onClick={() => createAgent()}>
                        <DynamicIcons iconName="FaPlus" size={17} color="white" />
                      </div>
                    </div>
                  </section>
                  <hr />
                </div>
                {loggedUser?.currentProfileInfo.identifier !== loggedUser?.identifier && (
                  <div>
                    <section className="general-sec">
                      <h5 className="sec-general-label">Logged as: </h5>
                      <div className="option-menu-list">
                        <div
                          className={[
                            'menu-option',
                            'menu-option-membership',
                            loggedUser?.checkPermissions(loggedUser?.currentProfileInfo.identifier).isInProfile
                              ? 'current-profile'
                              : '',
                          ].join(' ')}
                          key={`artist-current-profile`}
                        >
                          <AvatarWithIcon
                            name=""
                            image={profilePicturesURLs[loggedUser?.currentProfileInfo?.identifier]}
                            avatarSize={'3rem'}
                            buttonIcon={
                              !loggedUser?.checkPermissions(loggedUser?.currentProfileInfo.identifier).isInProfile &&
                              'PiUserSwitch'
                            }
                            onClick={() => handleResultOnClick(loggedUser?.currentProfileInfo)}
                            onBadgeClick={() => switchProfile(loggedUser?.currentProfileInfo)}
                          />
                          <div onClick={() => handleResultOnClick(loggedUser?.currentProfileInfo)}>
                            <p className="menu-option-label">{loggedUser?.currentProfileInfo.name}</p>
                            {loggedUser?.currentProfileInfo.username && (
                              <p className="menu-option-membership-label ">
                                @{loggedUser?.currentProfileInfo.username}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                    <hr />
                  </div>
                )}
                {AVAILABLE_ENTITY_MEMBERSHIPS.map((entityMembershipName: string, index: number) => {
                  return (
                    <div key={`${entityMembershipName}_${index}`}>
                      <section className="general-sec">
                        {/* ----------  Row header  ------------ */}
                        <div className="entity-row-container">
                          <h5 className="label">{translateGlobalDict(`entities.${entityMembershipName}.plural`)}</h5>
                          <div className="icon" onClick={() => createNewEntityInstance(entityMembershipName)}>
                            <DynamicIcons iconName="FaPlus" size={17} color="white" />
                          </div>
                        </div>

                        {/* ----------  Entity Instances List  ------------ */}
                        <div className="option-menu-list">
                          {loggedUser
                            ?.getMembershipsByEntity(entityMembershipName)
                            .filter(
                              (profileInfo: CurrentProfileInfoModel) =>
                                profileInfo.identifier !== loggedUser.currentProfileInfo.identifier
                            )
                            .map((profileInfo: CurrentProfileInfoModel, index: number) => {
                              return (
                                <div
                                  className={[
                                    'menu-option',
                                    'menu-option-membership',
                                    loggedUser?.checkPermissions(profileInfo.identifier).isInProfile
                                      ? 'current-profile'
                                      : '',
                                  ].join(' ')}
                                  key={`artist-${index}`}
                                >
                                  <AvatarWithIcon
                                    name=""
                                    image={profilePicturesURLs[profileInfo.identifier]}
                                    avatarSize={'3rem'}
                                    buttonIcon={
                                      !loggedUser?.checkPermissions(profileInfo.identifier).isInProfile &&
                                      'PiUserSwitch'
                                    }
                                    onClick={() => handleResultOnClick(profileInfo)}
                                    onBadgeClick={() => switchProfile(profileInfo)}
                                  />
                                  <div onClick={() => handleResultOnClick(profileInfo)}>
                                    <p className="menu-option-label">{profileInfo.name}</p>
                                    {profileInfo.username && (
                                      <p className="menu-option-membership-label ">@{profileInfo.username}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          {loggedUser
                            ?.getMembershipsByEntity(entityMembershipName)
                            .filter(
                              (profileInfo: CurrentProfileInfoModel) =>
                                profileInfo.identifier !== loggedUser.currentProfileInfo.identifier
                            ).length === 0 &&
                            `No se encontraron más ${translateGlobalDict(
                              `entities.${entityMembershipName}.plural`
                            ).toLowerCase()}`}
                        </div>
                      </section>
                      <hr />
                    </div>
                  );
                })}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default SideNav;

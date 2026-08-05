import { Badge } from '@mui/material';
import { signOut } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { Container, Navbar, Offcanvas } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { getEnvironment } from '~/common/utils/app-utils/app-utils';
import { resolveNavigateToEntityPath } from '~/common/utils/hooks/navigation/navigateToEntityResolver';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { isVisible } from '~/common/utils/visibility-utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import { SearchComponent } from '~/components/shared/search';
import { PATHS, SUB_PATHS } from '~/constants';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { SearchableTemplate } from '~/models/base';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { ProfilePicture } from '../atoms/gui/ProfilePicture/ProfilePicture';
import { MembershipsList } from './MembershipsList';
import './index.scss';
import { LEFT_SIDENAV_MENU_CONFIG, RIGHT_SIDENAV_MENU_CONFIG, SideMenuItem } from './sidenav.config';

const TRANSLATION_BASE_SIDENAV = 'app.appbase.sidenav';

type RIGHT_SIDENAV_VIEWS = 'actions' | 'memberships_list';

const SideNav = () => {
  const loggedUser = useSelector(selectCurrentUser);
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [currentRightView, setCurrentRightView] = useState<RIGHT_SIDENAV_VIEWS>('actions');
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
  const navigateTo = (
    params: { path: string; useRandomId?: boolean; state?: any } = { path: '', useRandomId: false, state: {} }
  ) => {
    let { path, useRandomId, state } = params;
    state = state || {};
    state.originProfile = loggedUser?.currentProfileInfo;

    let paramId = '';
    if (useRandomId) {
      paramId = `${Math.floor(Math.random() * 18) + 1}`;
    }
    if (path) {
      navigateToInnerPath({ path: `${path}/${paramId}`, options: { state } });
    } else {
      navigateToInnerPath({ path: ``, options: { state } });
    }
    setShow(false);
    setShowRight(false);
  };

  useEffect(() => {
    setOpenStatusSearchInputText(false);
  }, [location]);

  const liMenuElement = (section: any, menuOption: any, idx: number, level = 0) => {
    return (
      <RequireAuthComponent
        allowedRoles={menuOption.allowedRoles}
        requiredSession={menuOption.requireSession}
        name={menuOption.name}
        key={idx}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            className="menu-option"
            href={void 0}
            onClick={() => {
              if (menuOption?.path) {
                navigateTo({ path: menuOption?.path, useRandomId: menuOption.randomId, state: {} });
              } else if (menuOption?.handler && Object.keys(handlers).includes(menuOption?.handler)) {
                handlers[menuOption?.handler]();
              }
            }}
            style={{ paddingLeft: `${level * 3}rem` }}
          >
            {
              <>
                <DynamicIcons iconName={menuOption.icon || 'AiFillFile'} size={25} />
                <span className="menu-option-label">{translateText(menuOption.name)}</span>
                {menuOption.badge && menuOption.badge instanceof Function && menuOption.badge() > 0 && (
                  <Badge
                    badgeContent={menuOption.badge()}
                    color="success"
                    sx={{
                      marginLeft: '1.5rem',
                      '& .MuiBadge-badge': {
                        fontSize: '1.1rem',
                        // color: 'white',
                        // height: '22px',
                        // minWidth: '22px',
                        // padding: '0 6px',
                      },
                    }}
                  />
                )}
              </>
            }{' '}
          </a>

          {menuOption.rightIcon && (
            <span
              onClick={() => {
                if (menuOption?.rightPath) {
                  navigateTo({ path: menuOption?.rightPath, useRandomId: menuOption.randomId, state: {} });
                } else if (menuOption?.rightHandler && Object.keys(handlers).includes(menuOption?.rightHandler)) {
                  handlers[menuOption?.rightHandler]();
                }
              }}
            >
              <DynamicIcons iconName={menuOption.rightIcon} size={17} color="white" />
            </span>
          )}
        </div>
        {menuOption.nestedMenuOptions &&
          menuOption.nestedMenuOptions.length &&
          menuOption.nestedMenuOptions.map((childOption: any, index: number) =>
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

  const goToHome = () => navigateTo({ path: PATHS.HOME });

  const userID = getStoredUserIdToken();

  const changeRightMenuView = (newView?: RIGHT_SIDENAV_VIEWS) => {
    setCurrentRightView(newView || 'actions');
  };

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

  useEffect(() => {
    if (showRight) {
      setCurrentRightView('actions');
    }
  }, [showRight]);

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
  // console.log(loggedUser);
  // console.log('CURRENT PROFILE ', loggedUser?.currentProfileInfo);
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
                  setShowRight(true);
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
                {LEFT_SIDENAV_MENU_CONFIG.filter((sidenavSection, index) => {
                  const isHidden = !isVisible(sidenavSection, { user: loggedUser, section: sidenavSection });

                  const isAllowedByEnvironment =
                    (!sidenavSection.allowedEnvironments ||
                      sidenavSection.allowedEnvironments.includes(getEnvironment())) &&
                    (!sidenavSection.forbiddenEnvironments ||
                      !sidenavSection.forbiddenEnvironments.includes(getEnvironment()));

                  return isHidden && isAllowedByEnvironment;
                }).map((sidenavSection, index) => {
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
                            {sectionOptions
                              .filter((option, index) => {
                                const isHidden = !isVisible(option, { user: loggedUser, option: option });

                                const isAllowedByEnvironment =
                                  (!option.allowedEnvironments ||
                                    option.allowedEnvironments.includes(getEnvironment())) &&
                                  (!option.forbiddenEnvironments ||
                                    !option.forbiddenEnvironments.includes(getEnvironment()));

                                return isHidden && isAllowedByEnvironment;
                              })
                              .map((option: SideMenuItem, idx) => {
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
                // onClick={() => handleResultOnClick(loggedUser)}
              >
                <div
                  className={[
                    'profile-header-sidenav',
                    // loggedUser?.checkPermissions(loggedUser?.currentProfileInfo.identifier).isInProfile
                    //   ? 'current-profile'
                    //   : '',
                  ].join(' ')}
                >
                  {currentRightView === 'memberships_list' && (
                    <div
                      style={{ alignSelf: 'center', marginRight: '0.5rem' }}
                      onClick={() => setCurrentRightView('actions')}
                    >
                      <DynamicIcons iconName="FaChevronLeft" color={'white'} size={20} />
                    </div>
                  )}
                  <div style={{ alignSelf: 'center' }}>
                    <AvatarWithIcon
                      name=""
                      image={profilePicturesURLs[loggedUser?.currentProfileInfo?.identifier]}
                      avatarSize={'3.5rem'}
                      buttonIcon={loggedUser?.hasIndustryProfiles && currentRightView === 'actions' && 'PiUserSwitch'}
                      onClick={() => handleResultOnClick(loggedUser.currentProfileInfo)}
                      onBadgeClick={() => changeRightMenuView('memberships_list')}
                    />
                  </div>
                  <div
                    className="profile-header-name"
                    onClick={() => handleResultOnClick(loggedUser.currentProfileInfo)}
                  >
                    <h4>{loggedUser?.currentProfileInfo?.name}</h4>
                    <p>@{loggedUser?.currentProfileInfo?.username}</p>
                  </div>
                </div>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {currentRightView === 'actions' && (
                  <>
                    <hr />
                    {RIGHT_SIDENAV_MENU_CONFIG.filter((sidenavSection, index) => {
                      const isHidden = !isVisible(sidenavSection, { user: loggedUser, section: sidenavSection });

                      const isAllowedByEnvironment =
                        (!sidenavSection.allowedEnvironments ||
                          sidenavSection.allowedEnvironments.includes(getEnvironment())) &&
                        (!sidenavSection.forbiddenEnvironments ||
                          !sidenavSection.forbiddenEnvironments.includes(getEnvironment()));

                      return isHidden && isAllowedByEnvironment;
                    }).map((sidenavSection, index) => {
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
                                {sectionOptions
                                  .filter((option, index) => {
                                    const isHidden = !isVisible(option, { user: loggedUser, option: option });

                                    const isAllowedByEnvironment =
                                      (!option.allowedEnvironments ||
                                        option.allowedEnvironments.includes(getEnvironment())) &&
                                      (!option.forbiddenEnvironments ||
                                        !option.forbiddenEnvironments.includes(getEnvironment()));

                                    return isHidden && isAllowedByEnvironment;
                                  })
                                  .map((option: SideMenuItem, idx) => {
                                    return liMenuElement('general', option, idx);
                                  })}
                              </div>
                            </section>
                            <hr />
                          </div>
                        </RequireAuthComponent>
                      );
                    })}
                  </>
                )}
                {currentRightView === 'memberships_list' && (
                  <>
                    <div>
                      <section className="general-sec">
                        {!loggedUser?.isInPersonalProfile && (
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
                              image={profilePicturesURLs[loggedUser?.identifier]}
                              avatarSize={'3rem'}
                              buttonIcon={
                                !loggedUser?.checkPermissions(loggedUser?.identifier).isInProfile && 'PiUserSwitch'
                              }
                              onClick={() => handleResultOnClick(loggedUser)}
                              onBadgeClick={() => switchProfile(loggedUser)}
                            />
                            <div onClick={() => handleResultOnClick(loggedUser)}>
                              <p className="menu-option-label">{loggedUser.nameKnownAs}</p>
                              {loggedUser.username && (
                                <p className="menu-option-membership-label ">@{loggedUser.username}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </section>
                      <hr />
                    </div>
                    <MembershipsList
                      loggedUser={loggedUser}
                      profilePicturesURLs={profilePicturesURLs}
                      handlers={{ createAgent, createNewEntityInstance, handleResultOnClick, switchProfile }}
                    />
                  </>
                )}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default SideNav;

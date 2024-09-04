import { useState } from 'react';
import { Container, Navbar, Offcanvas } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { useUsersSlice } from '~/common/slices/users';
import { useI18n } from '~/common/utils';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { SearchComponent } from '~/components/shared/search';
import { PATHS } from '~/constants';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { SearchableTemplate } from '~/models/base';
import { ProfilePicture } from '../atoms/gui/ProfilePicture/ProfilePicture';
import AvatarWithIcon from '../atoms/gui/avatar-with-icon/Avatar-with-icon';
import './index.scss';
import { SIDENAV_MENU_CONFIG, SideMenuItem } from './sidenav.config';

const TRANSLATION_BASE_SIDENAV = 'app.appbase.sidenav';

const SideNav = () => {
  const { loggedUser } = useAuth();

  const [show, setShow] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [openStatusSearchInputText, setOpenStatusSearchInputText] = useState(false);
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
    logout: () => {
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
    dispatch(usersActions.switchProfile({ id: element.identifier }));
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
                src={loggedUser?.currentProfileInfo?.profile_pic}
                onClickHandler={() => {
                  setShowRight(true); // Mostrar el Offcanvas derecho
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
              <Offcanvas.Header closeButton className="sidebar-header" closeVariant="white">
                <div className="profile-header">
                  <AvatarWithIcon
                    name=""
                    image={loggedUser?.profile_pic}
                    avatarSize={'3.5rem'}
                    buttonIcon={!loggedUser?.checkPermissions(loggedUser?.identifier).isInProfile && 'PiUserSwitch'}
                    onClick={() => handleResultOnClick(loggedUser)}
                    onBadgeClick={() => switchProfile(loggedUser)}
                  />
                  <div className="profile-header-name">
                    <h4>{loggedUser?.artistic_name || loggedUser?.given_names}</h4>
                    <p>@{loggedUser?.username}</p>
                  </div>
                </div>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <hr />
                <div>
                  <section className="general-sec">
                    <h5 className="sec-general-label">{translateGlobalDict('entities.artists.plural')}</h5>
                    <div className="option-menu-list">
                      {loggedUser?.artistMemberships.map((profileInfo: CurrentProfileInfoModel, index: number) => {
                        return (
                          <div
                            className={[
                              'menu-option',
                              'menu-option-membership',
                              loggedUser?.checkPermissions(profileInfo.identifier).isInProfile ? 'current-profile' : '',
                            ].join(' ')}
                            key={`artist-${index}`}
                          >
                            <AvatarWithIcon
                              name=""
                              image={profileInfo.profile_pic}
                              avatarSize={'3rem'}
                              buttonIcon={
                                !loggedUser?.checkPermissions(profileInfo.identifier).isInProfile && 'PiUserSwitch'
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
                    </div>
                  </section>
                  <hr />
                </div>
                <div>
                  <section className="general-sec">
                    <h5 className="sec-general-label">{translateGlobalDict('entities.places.plural')}</h5>
                    <div className="option-menu-list">
                      {loggedUser?.placeMemberships.map((profileInfo: CurrentProfileInfoModel, index: number) => {
                        return (
                          <div
                            className={[
                              'menu-option',
                              'menu-option-membership',
                              loggedUser?.checkPermissions(profileInfo.identifier).isInProfile ? 'current-profile' : '',
                            ].join(' ')}
                            key={`artist-${index}`}
                          >
                            <AvatarWithIcon
                              name=""
                              image={profileInfo.profile_pic}
                              avatarSize={'3rem'}
                              buttonIcon={
                                !loggedUser?.checkPermissions(profileInfo.identifier).isInProfile && 'PiUserSwitch'
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
                    </div>
                  </section>
                  <hr />
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default SideNav;

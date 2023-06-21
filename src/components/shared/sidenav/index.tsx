import { useState } from "react";
import { Container, Navbar, Offcanvas } from "react-bootstrap";
import { useI18n } from "~/common/utils";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import { useNavigation } from "~/common/utils/hooks/navigation/navigation";
import DynamicIcons from "~/components/shared/DynamicIcons";
import { RequireAuthComponent } from "~/components/shared/atoms/app/auth/RequiredAuth";
import BetaBarComponent from "~/components/shared/organisms/app/BetaBar/beta-bar";
import { SearchComponent } from "~/components/shared/search";
import { PATHS } from "~/constants";
import { SearchableTemplate } from "~/models/base";
import { ProfilePicture } from "../atoms/gui/ProfilePicture/ProfilePicture";
import "./index.scss";
import { SIDENAV_MENU_CONFIG, SideMenuItem } from "./sidenav.config";

const TRANSLATION_BASE_SIDENAV = "app.appbase.sidenav";
const SideNav = () => {
  const { loggedUser, setLoggedUser } = useAuth();
  const [show, setShow] = useState(false);
  const [openStatusSearchInputText, setOpenStatusSearchInputText] =
    useState(false);
  const { navigateToEntity, navigateToInnerPath } = useNavigation();
  const { translateText } = useI18n();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const showHideSearchField = (event: any) => {
    setOpenStatusSearchInputText(!openStatusSearchInputText);
  };
  const navigateTo = (
    path: string | undefined,
    useRandomId: boolean = false
  ) => {
    let paramId = "";
    if (useRandomId) {
      paramId = `${Math.floor(Math.random() * 18) + 1}`;
    }
    if (path) {
      navigateToInnerPath({ path: `${path}/${paramId}` });
    } else {
      navigateToInnerPath({ path: `` });
    }
    setShow(false);
  };
  const liMenuElement = (section: string, note: SideMenuItem, idx: number) => {
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
          onClick={() => navigateTo(note?.path, note.randomId)}
        >
          <DynamicIcons iconName={note.icon || "AiFillFile"} size={20} />
          <span className="menu-option-label">{translateText(note.name)}</span>
        </a>
      </RequireAuthComponent>
    );
  };

  let searchIcon = "AiOutlineSearch";
  if (openStatusSearchInputText) {
    searchIcon = "MdSearchOff";
  }
  const handleResultOnClick = (element: SearchableTemplate) => {
    setOpenStatusSearchInputText(false);
    navigateToEntity({ entityType: element.constructor.name, id: element.id });
  };
  return (
    <>
      <BetaBarComponent />
      <Navbar className="toolbar-header mb-3" expand="true">
        <Container fluid>
          <div className="nav-menu-opt">
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand`}
              className="icon-burger"
              onClick={handleShow}
            />
            <a href="/">
              <img
                alt="Artists Hive Logo"
                className="img-logotipo"
                src="https://npcarlos.co/artistsHive_mocks/logo.png"
                width="100"
              />
            </a>
          </div>

          <div className="nav-search-opt">
            <SearchComponent
              openedStatus={openStatusSearchInputText}
              onClick={handleResultOnClick}
            />
          </div>

          <div className="nav-login-opt">
            <span onClick={showHideSearchField}>
              <DynamicIcons iconName={searchIcon} size={30} />
            </span>
            {loggedUser && (
              <ProfilePicture src={loggedUser.profile_pic} size="xs" />
            )}
            {!loggedUser && (
              <a
                className="brand-text"
                onClick={() => navigateToInnerPath({ path: PATHS.LOGIN })}
              >
                Log in
              </a>
            )}
          </div>

          {!!show && (
            <Navbar.Offcanvas
              placement="start"
              show={show}
              onHide={handleClose}
            >
              <Offcanvas.Header closeButton className="sidebar-header">
                <a href="/">
                  <img
                    alt="Artists Hive Logo"
                    className="img-logotipo"
                    src="https://npcarlos.co/artistsHive_mocks/logo.png"
                    width="100"
                  />
                </a>
                <h4 className="menu-title">
                  {translateText(`${TRANSLATION_BASE_SIDENAV}.name`)}
                </h4>
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
                          <h5 className="sec-general-label">
                            {translateText(sidenavSection.name)}
                          </h5>
                          <div className="option-menu-list">
                            {sectionOptions.map((option: SideMenuItem, idx) => {
                              return liMenuElement("general", option, idx);
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
        </Container>
      </Navbar>
    </>
  );
};
export default SideNav;

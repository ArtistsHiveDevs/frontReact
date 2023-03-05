import { useState } from "react";
import { Container, Navbar, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useI18n } from "~/common/utils";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import DynamicIcons from "~/components/shared/DynamicIcons";
import { RequireAuthComponent } from "~/components/shared/atoms/app/auth/RequiredAuth";
import { SearchComponent } from "~/components/shared/search";
import { PATHS, SUB_PATHS } from "~/constants";
import { SearchableTemplate } from "~/models/base";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import { ProfilePicture } from "../atoms/gui/ProfilePicture/ProfilePicture";
import "./index.scss";
import { SIDENAV_MENU_CONFIG, SideMenuItem } from "./sidenav.config";
const TRANSLATION_BASE_SIDENAV = "app.appbase.sidenav";
const SideNav = () => {
  const { loggedUser, setLoggedUser } = useAuth();
  const [show, setShow] = useState(false);
  const [openStatusSearchInputText, setOpenStatusSearchInputText] =
    useState(false);
  const navigate = useNavigate();
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
      navigate(`${path}/${paramId}`);
    } else {
      navigate(``);
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
    let newEntity = PATHS.ARTISTS;
    if (element instanceof PlaceModel) {
      newEntity = PATHS.PLACES;
    } else if (element instanceof EventModel) {
      newEntity = PATHS.EVENTS;
    }
    setOpenStatusSearchInputText(false);
    navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${element.id}`);
  };
  return (
    <>
      <Navbar className="toolbar-header mb-3" expand="true">
        <Container fluid>
          <div>
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand`}
              className="icon-burger"
              onClick={handleShow}
            />
            <img
              alt="Artists Hive Logo"
              className="img-logotipo"
              src="https://npcarlos.co/artistsHive_mocks/logo.png"
              width="100"
            />
          </div>
          <div>
            <span onClick={showHideSearchField}>
              <DynamicIcons iconName={searchIcon} size={30} />
            </span>
            {loggedUser && (
              <ProfilePicture src={loggedUser.profile_pic} size="xs" />
            )}
            {!loggedUser && (
              <a className="brand-text" href="#">
                Log in
              </a>
            )}
          </div>
          <SearchComponent
            openedStatus={openStatusSearchInputText}
            onClick={handleResultOnClick}
          />
          {!!show && (
            <Navbar.Offcanvas
              placement="start"
              show={show}
              onHide={handleClose}
            >
              <Offcanvas.Header closeButton className="sidebar-header">
                <img
                  alt="Artists Hive Logo"
                  className="img-logotipo"
                  src="https://npcarlos.co/artistsHive_mocks/logo.png"
                  width="100"
                />
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

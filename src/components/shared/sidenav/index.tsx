import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "./index.scss";

const SideNav = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const general: Section[] = [
    {
      name: "Home",
      path: "",
      updated: new Date("2/20/16"),
    },
    {
      name: "Mi banda",
      path: "artist",
      updated: new Date("2/20/16"),
    },
    {
      name: "Riders Técnicos",
      path: "riders",
      updated: new Date("2/20/16"),
    },
    {
      name: "Próximos eventos",
      path: "events",
      updated: new Date("1/18/16"),
    },
  ];

  const liMenuElement = (section: string, note: Section, idx: number) => {
    return (
      <>
        <a href="#" className="menu-option">
          <img
            alt="page Logo"
            className="menu-option-img"
            src="/src/assets/img/page-empty.svg"
          />
          <span className="menu-option-label">{note.name}</span>
        </a>
      </>
    );
  };

  return (
    <>
      <Navbar expand="true" className="toolbar-header mb-3">
        <Container fluid>
          <div>
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand`}
              onClick={handleShow}
              className="icon-burger"
            />
            <Navbar.Brand href="#" className="brand-text">
              Artist Hive
            </Navbar.Brand>
          </div>
          <div>
            <img
              width="100"
              alt="Artists Hive Logo"
              src="/src/assets/img/logo.png"
            />
          </div>
          {!!show && (
            <Navbar.Offcanvas
              show={show}
              onHide={handleClose}
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <h1 className="menu-brand">Artist Hive</h1>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <h4 className="menu-title">Menú principal</h4>
                <hr />
                <section className="general-sec">
                  <>
                    <h5 className="sec-general-label">General</h5>
                    <div className="option-menu-list">
                      {general.map((general: Section, idx) => {
                        return liMenuElement("general", general, idx);
                      })}
                    </div>
                  </>
                </section>
                <hr />
                {/* <section>
                                    <h5 className='sec-general'>Herramientas</h5>
                                </section> */}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default SideNav;

export interface Section {
  name: string;
  updated: Date;
  path?: string;
}

import React from "react";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  HOME_ENDPOINT,
  NEW_TICKET_ENDPOINT,
  TICKETS_ENDPOINT,
} from "../helpers/endpoints";

const CustomNavbar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={HOME_ENDPOINT}>Inicio</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav" className="mr-5">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to={NEW_TICKET_ENDPOINT}>
              Crear ticket
            </Nav.Link>
            <Nav.Link as={NavLink} to={TICKETS_ENDPOINT}>
              Mis tickets
            </Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              title="admin.admin"
              id="collasible-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#">Salir</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

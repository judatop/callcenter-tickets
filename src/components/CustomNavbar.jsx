import React from "react";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { HOME_URL, NEW_TICKET_URL, TICKETS_URL } from "../helpers/urls.js";
import { useAuthDispatch, useAuthState } from "../context/authContext";

const CustomNavbar = () => {
  const authDispatch = useAuthDispatch();
  const navigate = useNavigate();
  const user = useAuthState();

  const logout = () => {
    authDispatch({
      type: "logout",
    });
    navigate("/login");
  };

  return (
    <div>
      {user.isAuthenticated ? (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href={HOME_URL}>Inicio</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse id="responsive-navbar-nav" className="mr-5">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to={NEW_TICKET_URL}>
                  Crear ticket
                </Nav.Link>
                <Nav.Link as={NavLink} to={TICKETS_URL}>
                  Mis tickets
                </Nav.Link>
              </Nav>

              <Nav>
                <NavDropdown
                  title={user.username}
                  id="collasible-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item onClick={logout}>Salir</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default CustomNavbar;

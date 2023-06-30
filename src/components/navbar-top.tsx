import { FC } from "react";
import { Container, Navbar, NavDropdown, Nav } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const NavbarTop: FC = () => {
  const { loginWithRedirect, logout, user } = useAuth0();
  const clientURL: string = import.meta.env.VITE_AUTH0_SPA_URL;

  const handleAuthProcess = async (): Promise<void> => {
    await loginWithRedirect({
      appState: {
        returnTo: "/",
      },
    });
  };

  const handleLogout = (): void => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <Navbar expand="sm" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={`/`}>
          Ghost-Multiplayer-Online
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <>
              <Avatar src={user.picture} />
              <NavDropdown
                title={user[`${clientURL}/username`]}
                className="ms-2"
              >
                <NavDropdown.Item as={Link} to={`/profile`}>
                  Account Settings
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  <i>Logout</i>
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <Nav>
              <Nav.Link onClick={handleAuthProcess}>Login | Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;

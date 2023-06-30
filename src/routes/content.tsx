import { FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Username from "../components/username";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";

const Content: FC = () => {
  const { user } = useAuth0();
  const location = useLocation();
  const clientURL: string = import.meta.env.VITE_AUTH0_SPA_URL;

  if (user && !user[`${clientURL}/usernameConfirmed`]) {
    return (
      <Container className="py-5">
        <Username />
      </Container>
    );
  }

  if (location.pathname === "/") {
    return <Outlet />;
  }

  return (
    <Container className="py-5">
      <Outlet />
    </Container>
  );
};

export default Content;

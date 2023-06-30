import { FC } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const AuthGuard: FC = () => {
  const Component = withAuthenticationRequired(Outlet, {
    onRedirecting: () => (
      <div className="text-center">
        <Spinner animation="border"></Spinner>
      </div>
    ),
  });

  return <Component />;
};

export default AuthGuard;

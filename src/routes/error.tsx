import { FC } from "react";
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Button } from "react-bootstrap";

const ErrorPage: FC = () => {
  const routeError = useRouteError();
  const { error: authError } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container>
      <div className="text-center">
        <h3 className="mt-5 mb-3">An unexpected error occurred</h3>
        {(isRouteErrorResponse(routeError) && (
          <div className="text-break mb-2">
            <i>{routeError.data?.message || routeError.statusText}</i>
          </div>
        )) ||
          (routeError instanceof Error && (
            <div className="text-break mb-2">
              <i>{routeError.message}</i>
            </div>
          )) ||
          (authError && (
            <div className="text-break mb-2">
              <i>{authError.message}</i>
            </div>
          )) || (
            <div className="text-break mb-2">
              <i>{location.state?.error || "Unknown error"}</i>
            </div>
          )}
        <Button
          onClick={() => {
            navigate(-1);
          }}
          variant="link"
          size="lg"
        >
          Go back
        </Button>
      </div>
    </Container>
  );
};

export default ErrorPage;

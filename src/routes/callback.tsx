import { FC } from "react";
import { Container, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";

const Callback: FC = () => {
  const { error } = useAuth0();
  const navigate = useNavigate();

  if (error) {
    return (
      <Container>
        <div className="text-center">
          <h3 className="mt-5 mb-3">An unexpected error occurred</h3>
          <div className="text-break mb-3">{<i>{error.message}</i>}</div>
          <Button
            onClick={() => {
              navigate("/");
            }}
            variant="link"
            size="lg"
          >
            Go to home page
          </Button>
        </div>
      </Container>
    );
  }

  return <Loader />;
};

export default Callback;

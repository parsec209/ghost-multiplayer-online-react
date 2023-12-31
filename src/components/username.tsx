import { FC, FormEvent, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUsername } from "../services/postService";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import handleError from "../util/error-handler";

const Username: FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    const form = e.currentTarget;
    e.preventDefault();
    setValidated(true);
    if (form.checkValidity() === true) {
      try {
        setIsLoading(true);
        const token = await getAccessTokenSilently();
        if (user?.sub) {
          await updateUsername(user.sub, username, token);
        }
        setIsLoading(false);
        window.location.replace(import.meta.env.VITE_AUTH0_SPA_URL); //Reload app to get updated Auth0 user object
      } catch (err) {
        setIsLoading(false);
        navigate("/error", {
          state: {
            error: handleError(err),
          },
        });
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(233, 244, 245)",
      }}
    >
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="my-5">
              <Card.Header
                className="text-center fs-4"
                style={{ backgroundColor: "lightGray" }}
              >
                Create username
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Enter a custom username, or keep the random default one in the
                  top navigation bar (view it on smaller screens by clicking the
                  hamburger icon). Your username CANNOT be changed later.
                </Card.Text>
                <br />
                {isLoading ? (
                  <div className="text-center">
                    <Spinner animation="border"></Spinner>
                  </div>
                ) : (
                  <>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Form.Group>
                        <Form.Control
                          required
                          maxLength={20}
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a username, max 20 characters.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <br />
                      <Button type="submit">Save</Button>
                    </Form>
                    <br />
                    <Link reloadDocument to={"/"}>
                      Use default username
                    </Link>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Username;

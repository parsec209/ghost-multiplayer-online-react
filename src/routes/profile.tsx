import { useState, useEffect, FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Card, Form, Spinner } from "react-bootstrap";
import {
  deleteAccount,
  deleteEmailee,
  postEmailee,
  getEmailee,
} from "../services/postService";
import handleError from "../util/error-handler";

const Profile: FC = () => {
  const { getAccessTokenSilently, logout, user } = useAuth0();
  const clientURL: string = import.meta.env.VITE_AUTH0_SPA_URL;
  const username: string | undefined = user && user[`${clientURL}/username`];
  const loginMethod: string | undefined =
    user?.sub && user.sub.substring(0, user.sub.lastIndexOf("|"));
  const capitalizedLoginMethod: string | undefined =
    loginMethod && loginMethod.charAt(0).toUpperCase() + loginMethod.slice(1);
  const navigate = useNavigate();

  const [emailsAreSent, setEmailsAreSent] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  const toggleEmailPreference = async (): Promise<void> => {
    try {
      if (user?.email && username) {
        setIsLoadingProfile(true);
        const updatedEmailsAreSent = !emailsAreSent;
        const token = await getAccessTokenSilently();

        if (!updatedEmailsAreSent) {
          await deleteEmailee(username, token);
        } else {
          await postEmailee({ username, email: user.email }, token);
        }
        setEmailsAreSent(updatedEmailsAreSent);
        setIsLoadingProfile(false);
      }
    } catch (err) {
      setIsLoadingProfile(false);
      navigate("/error", {
        state: {
          error: handleError(err),
        },
      });
    }
  };

  const deleteUserAccount = async (): Promise<void> => {
    if (user?.sub) {
      if (
        confirm(
          "This is irreversible and you will lose your game history. Are you sure?"
        )
      ) {
        try {
          const token = await getAccessTokenSilently();
          await deleteAccount(user.sub, token);
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          });
        } catch (err) {
          navigate("/error", {
            state: {
              error: handleError(err),
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      try {
        if (username) {
          setIsLoadingProfile(true);
          const token = await getAccessTokenSilently();
          const emailee = await getEmailee(username, token);
          if (emailee) {
            setEmailsAreSent(true);
          }
          setIsLoadingProfile(false);
        }
      } catch (err) {
        setIsLoadingProfile(false);
        navigate("/error", {
          state: {
            error: handleError(err),
          },
        });
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        <Card>
          <Card.Header
            className="text-center fs-4"
            style={{ backgroundColor: "lightGray" }}
          >
            Account Settings
          </Card.Header>
          <Card.Body>
            <p>
              <strong>Username:</strong> {username}
            </p>
            <br />
            <p>
              <strong>Login method:</strong> {capitalizedLoginMethod}
            </p>
            <br />
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <br />
            <br />
            {isLoadingProfile ? (
              <div className="text-center">
                <Spinner animation="border"></Spinner>
              </div>
            ) : (
              <Form.Check
                checked={emailsAreSent}
                type="switch"
                label="Send game alert emails"
                onChange={toggleEmailPreference}
              />
            )}
            <br />
            <br />
            <Button variant="danger" onClick={deleteUserAccount}>
              Delete account
            </Button>
            <Button
              onClick={() => {
                navigate(-1);
              }}
              variant="link"
            >
              Go back
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;

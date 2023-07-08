import { useEffect, useState, useRef, FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Container, Modal } from "react-bootstrap";
import backgroundImg from "../assets/library-ghosts.jpg";
import FallingTiles from "../components/falling-tiles";
import Instructions from "../components/instructions";

const letterDisplay: string[] = ["G", "H", "O", "S", "T"];

const Home: FC = () => {
  const { loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();
  const letterRefs = useRef<HTMLDivElement[]>([]);
  let areFalling: boolean = user ? false : true;

  const [show, setShow] = useState<boolean>(false);

  const handleLinkBtnClick = (path: string): void => {
    navigate(path);
  };

  const handleAuthProcess = async (): Promise<void> => {
    await loginWithRedirect({
      appState: {
        returnTo: "/",
      },
    });
  };

  useEffect(() => {
    if (!user) {
      const letters = letterRefs.current;
      letters.forEach((letter, index) => {
        const delay = (index + 1) * 500;
        setTimeout(() => {
          letter.style.display = "inline-block";
          letter.classList.add("fade-in");
        }, delay);
      });
    }
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <FallingTiles areFalling={areFalling} />
      <Container
        style={{
          position: "absolute",
          zIndex: "2",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {!user ? (
          <div id="home-content">
            <Row>
              <Col>
                <div className="d-flex justify-content-center mb-3">
                  {letterDisplay.map((letter, i) => (
                    <div
                      key={i}
                      style={{
                        display: "none",
                        color: "whiteSmoke",
                      }}
                      className="fs-2 fw-bolder border border-secondary border-5 m-lg-3 p-lg-5 m-md-2 p-md-4 m-sm-2 p-sm-4 m-1 p-3"
                      ref={(el: HTMLDivElement) => (letterRefs.current[i] = el)}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 4, offset: 4 }}>
                <div className="d-grid gap-2">
                  <Button
                    onClick={handleAuthProcess}
                    variant="light"
                    size="lg"
                    style={{ opacity: 0.6 }}
                  >
                    Login and play!
                  </Button>
                </div>
                <br />
              </Col>
              <Col md={{ span: 4, offset: 4 }}>
                <div className="d-grid gap-2">
                  <Button
                    variant="info"
                    size="lg"
                    style={{ opacity: 0.7 }}
                    onClick={() => setShow(true)}
                  >
                    Game rules
                  </Button>
                </div>
                <Modal show={show} onHide={() => setShow(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Rules</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Instructions />
                  </Modal.Body>
                </Modal>
              </Col>
            </Row>
          </div>
        ) : (
          <Row>
            <Col md={{ span: 4, offset: 4 }} className="mb-3">
              <div className="d-grid gap-2">
                <Button
                  onClick={() => handleLinkBtnClick("/opponents")}
                  variant="light"
                  size="lg"
                  style={{ opacity: 0.6 }}
                >
                  Find opponents
                </Button>
              </div>
            </Col>
            <Col md={{ span: 4, offset: 4 }}>
              <div className="d-grid gap-2">
                <Button
                  onClick={() => handleLinkBtnClick("/games")}
                  variant="info"
                  size="lg"
                  style={{ opacity: 0.7 }}
                >
                  View games
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;

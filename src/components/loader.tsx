import { FC } from "react";
import { Container, Spinner, Navbar } from "react-bootstrap";

const Loader: FC = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Ghost-Multiplayer-Online</Navbar.Brand>
        </Container>
      </Navbar>
      <div className="text-center mt-5">
        <Spinner animation="border"></Spinner>
      </div>
    </>
  );
};

export default Loader;

import { FC } from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Popover, OverlayTrigger } from "react-bootstrap";
import Instructions from "./instructions";

const popover = (
  <Popover>
    <Popover.Header as="h3">Rules</Popover.Header>
    <Popover.Body>
      <Instructions />
    </Popover.Body>
  </Popover>
);

const Footer: FC = () => {
  return (
    <MDBFooter bgColor="dark" className="text-center text-lg-start text-muted">
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>View the open source code on GitHub:</span>
        </div>
        <div>
          <MDBBtn
            floating
            className="m-1"
            style={{ backgroundColor: "black" }}
            href="https://github.com/parsec209/ghost-multiplayer-online-react"
            role="button"
          >
            <MDBIcon fab icon="github" />
          </MDBBtn>
        </div>
      </section>
      <section className="">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                <p>
                  <a href="#!" className="text-reset">
                    Instructions
                  </a>
                </p>
              </OverlayTrigger>
              <p>
                <a
                  href="https://www.merriam-webster.com/"
                  className="text-reset"
                >
                  Merriam-Webster
                </a>
              </p>
            </MDBCol>
            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <MDBIcon color="secondary" icon="envelope" className="me-3" />
                developer47392128@gmail.com
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2023 Copyright:{" "}
        <a className="text-reset fw-bold" href="">
          Ryan Galbreath
        </a>
      </div>
    </MDBFooter>
  );
};

export default Footer;

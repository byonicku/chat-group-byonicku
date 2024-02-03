import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";
import { useState } from "react";

Header.propTypes = {
  user: PropTypes.object,
  signInWithGoogle: PropTypes.func,
  logout: PropTypes.func,
  navigate: PropTypes.func,
};

export default function Header({ user, signInWithGoogle, logout }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className="bg-body-tertiary"
      fixed="top"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Chat Group
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => {
                navigate("/about");
                setExpanded(expanded ? false : "expanded");
              }}
            >
              About
            </Nav.Link>
          </Nav>
          {user ? (
            <>
              <Image
                roundedCircle
                width={35}
                src={user.photoURL}
                alt={user.displayName}
                referrerPolicy="no-referrer"
              />
              <p className="m-2">Welcome, {user.displayName}!</p>
              <Button variant="danger" onClick={logout}>
                <FontAwesomeIcon icon={faDoorOpen} /> Logout
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              onClick={() => {
                setExpanded(expanded ? false : "expanded");
                signInWithGoogle();
              }}
            >
              Sign in with Google
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

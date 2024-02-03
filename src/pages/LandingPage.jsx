import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";

LandingPage.propTypes = {
  user: PropTypes.object,
};

/*
    TODO
    1. Implement good landing page
    2. When already login make button to link to chat group
*/

export default function LandingPage(props) {
  const { user } = props;
  return (
    <>
      <Container className="d-flex flex-column align-items-center text-center my-5">
        <div>Welcome to Chat Group!</div>
        {user && (
          <Link to="/chat" className="btn btn-primary">
            Go to Chat Group
          </Link>
        )}
      </Container>
    </>
  );
}

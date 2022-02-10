import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';

function NavBar({ isLoggedIn, setUser }) {

  const logout = () => {
    fetch("/api/logout", {method: "DELETE"})
    .then(() => setUser())
    .catch(error => console.error("BLIMEY!! Something went wrong... ==>", error))
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="colorOne" variant="light">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Mini Maestro</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/create-new">
              <Nav.Link>Create New</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/how-it-works">
              <Nav.Link>How It Works</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about-me">
              <Nav.Link>About Me</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/sign-up">
              <Nav.Link>Sign Up</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/my-tunes">
              <Nav.Link>My Tunes</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/logout">
              <Nav.Link>Logout</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

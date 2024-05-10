import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const NavbarTop = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = (e) => {
    logout();
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={"/"}>
          Vehicle Expresso
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user && <Nav.Link onClick={handleClick}>Logout</Nav.Link>}
            {!user && (
              <Nav.Link as={Link} to={"/login"}>
                Login
              </Nav.Link>
            )}
            {!user && (
              <Nav.Link as={Link} to={"/signup"}>
                Signup
              </Nav.Link>
            )}
            <Nav.Link as={Link} to={"/searchparks"}>
              Search Parks
            </Nav.Link>
            <NavDropdown title="Services" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to={"/carwashrepair"}>
                Car Wash & Repair
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/pickupvanservice"}>
                Pickup Van Service
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/rentingcars"}>
                Renting Cars
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/longtermcare"}>
                Long Term Care
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/carinsurancerenewal"}>
                Car Insurance Renewal
              </NavDropdown.Item>
              {user && <NavDropdown.Divider />}
              {user && (
                <NavDropdown.Item href="#action/3.4">
                  {user.email}
                </NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;

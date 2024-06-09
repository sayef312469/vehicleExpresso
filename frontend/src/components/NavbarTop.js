import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

const NavbarTop = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const handleClick = (e) => {
    logout()
  }
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={'/'}
        >
          Vehicle Expresso
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user && <Nav.Link onClick={handleClick}>Logout</Nav.Link>}
            {!user && (
              <Nav.Link
                as={Link}
                to={'/login'}
              >
                Login
              </Nav.Link>
            )}
            {!user && (
              <Nav.Link
                as={Link}
                to={'/signup'}
              >
                Signup
              </Nav.Link>
            )}
            <Nav.Link
              as={Link}
              to={'/searchparks'}
            >
              Search Parks
            </Nav.Link>
            <NavDropdown
              title="Services"
              id="basic-nav-dropdown"
            >
              {user && user.id < 100 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addparkadmin'}
                >
                  Add Park
                </NavDropdown.Item>
              )}
              {user && user.id < 100 && <NavDropdown.Divider />}
              {user && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addvehicle'}
                >
                  Add Vehicle
                </NavDropdown.Item>
              )}
              {user && <NavDropdown.Divider />}

              {user && user.parkAdmin > 0 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/vehicleentryexit'}
                >
                  Vehicle Entry Exit
                </NavDropdown.Item>
              )}
              {user && user.parkAdmin > 0 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addrentinfo'}
                >
                  Add Rent Info
                </NavDropdown.Item>
              )}
              {user && user.parkAdmin > 0 && <NavDropdown.Divider />}
              <NavDropdown.Item
                as={Link}
                to={'/carwashrepair'}
              >
                Car Wash & Repair
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to={'/pickupvanservice'}
              >
                Pickup Van Service
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to={'/rentingcars'}
              >
                Renting Cars
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to={'/longtermcare'}
              >
                Long Term Care
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to={'/carinsurancerenewal'}
              >
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
  )
}

export default NavbarTop

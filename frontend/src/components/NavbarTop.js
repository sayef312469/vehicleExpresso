import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { useNotificationContext } from '../hooks/useNotificationContext'

const NavbarTop = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const { totalUnreadNotice, dispatch } = useNotificationContext()

  const handleClick = () => {
    logout()
  }

  useEffect(() => {
    if (!user) {
      return
    }
    const getNotice = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/totalunread',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userid: user.id,
          }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        console.log('unread', data.TOTAL_UNREAD)
        dispatch({ type: 'UNREAD', payload: data.TOTAL_UNREAD })
      }
    }
    getNotice()
  }, [user, dispatch])

  console.log('total unread', totalUnreadNotice)
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
          <span className="material-symbols-outlined">
            emoji_transportation
          </span>
          Vehicle Expresso
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to={'/searchparks'}
            >
              <span className="material-symbols-outlined">Search</span>Search
              Parks
            </Nav.Link>

            {user && (
              <Nav.Link
                as={Link}
                to={'/notification'}
              >
                <span className="material-symbols-outlined">notifications</span>
                Notifications
                {totalUnreadNotice > 0 && <sup>{totalUnreadNotice}</sup>}
              </Nav.Link>
            )}

            <NavDropdown
              title="Services"
              id="basic-nav-dropdown"
            >
              {user && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addvehicle'}
                >
                  <span className="material-symbols-outlined">
                    add_to_queue
                  </span>
                  Add Vehicle
                </NavDropdown.Item>
              )}
              {user && (
                <NavDropdown.Item
                  as={Link}
                  to={'/userparkhistory'}
                >
                  <span className="material-symbols-outlined">history_edu</span>
                  Your Park History
                </NavDropdown.Item>
              )}
              {user && <NavDropdown.Divider />}

              {user && user.id < 100 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addparkadmin'}
                >
                  <span className="material-symbols-outlined">nature</span>Add
                  Park
                </NavDropdown.Item>
              )}
              {user && user.id < 100 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/garageadminpay'}
                >
                  <span className="material-symbols-outlined">
                    mode_of_travel
                  </span>
                  Garage Payment
                </NavDropdown.Item>
              )}
              {user && user.id < 100 && <NavDropdown.Divider />}

              {user && user.parkAdmin > 0 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/vehicleentryexit'}
                >
                  <span className="material-symbols-outlined">upload</span>
                  Vehicle Entry Exit
                </NavDropdown.Item>
              )}
              {user && user.parkAdmin > 0 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addrentinfo'}
                >
                  <span className="material-symbols-outlined">
                    security_update_good
                  </span>
                  Add Rent Info
                </NavDropdown.Item>
              )}
              {user && user.parkAdmin > 0 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/parkhistory'}
                >
                  <span className="material-symbols-outlined">history</span>
                  Garage History
                </NavDropdown.Item>
              )}
              {user && user.parkAdmin > 0 && <NavDropdown.Divider />}
              <NavDropdown.Item
                as={Link}
                to={'/vehiclecare'}
              >
                Vehicle Care
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
                to={'/carinsurancerenewal'}
              >
                Car Insurance Renewal
              </NavDropdown.Item>
              {user && <NavDropdown.Divider />}
              {user && (
                <NavDropdown.Item href="#action/3.4">
                  <span className="material-symbols-outlined">mail</span>
                  {user.email}
                </NavDropdown.Item>
              )}
            </NavDropdown>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarTop

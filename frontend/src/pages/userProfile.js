import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  Card,
  Button,
  CardGroup,
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  FormControl,
  Alert,
} from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuthContext } from '../hooks/useAuthContext'
import defaultProfile from '../img/defaultProfile.png'

export default function ProfileTest() {
  const [userDetail, setUserDetail] = useState('')

  const [editPhone, setEditPhone] = useState(false)
  const [phone, setPhone] = useState(userDetail.PHONE || '')
  const [editAddress, setEditAddress] = useState(false)
  const [area, setArea] = useState(userDetail.AREA || '')
  const [city, setCity] = useState(userDetail.CITY || '')
  const [country, setCountry] = useState(userDetail.COUNTRY || '')

  const { user } = useAuthContext()
  const fileInputRef = useRef(null)
  const [parkingInfo, setParkingInfo] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchParkingInfo = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/api/user/profile-parking/' + user.id
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setParkingInfo(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchParkingInfo()
  }, [user])

  async function handleUpdate(phone, area, city, country) {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/user/update/${user.id}`,
        {
          phone,
          area,
          city,
          country,
        }
      )
      setUserDetail((prevState) => ({
        ...prevState,
        PHONE: phone,
        AREA: area,
        CITY: city,
        COUNTRY: country,
      }))
    } catch (error) {
      console.error('Error updating record', error)
      toast.error('Error updating record. Please try again later.')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/api/user/profile/' + user.id
        )
        const data = await response.json()
        if (response.ok) {
          setUserDetail(data)
          console.log(data)
        } else {
          console.log(data.error)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [user])

  const changePic = async () => {
    if ('showOpenFilePicker' in window) {
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'Images',
              accept: {
                'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
              },
            },
          ],
          excludeAcceptAllOption: true,
          multiple: false,
        })

        const file = await fileHandle.getFile()
        if (!file) {
          alert('No file selected.')
          return
        }
        console.log(`Selected file: ${file.name}`)
        const formData = new FormData()
        formData.append('file', file)
        console.log('Form data:', formData)

        try {
          const response = await axios.post(
            'http://localhost:4000/api/user/upload/' + user.id,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          if (response && response.data && response.data.PRO_URL) {
            const data = response.data.PRO_URL
            const det = { ...userDetail, PRO_URL: data }
            setUserDetail(det)
            toast.success('Profile picture uploaded successfully!')
          } else {
            throw new Error('Invalid response from server')
          }
        } catch (error) {
          console.error('Network error:', error)
          toast.error('Error uploading file. Please try again later.')
        }
      } catch (error) {
        console.error('File selection was cancelled or failed', error)
        toast.error('File selection was cancelled or failed. Please try again.')
      }
    } else {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log(`Selected file: ${file.name}`)
    }
  }

  const goRecord = () => {
    window.location.href = '/record'
  }

  const toggleEditPhone = () => {
    setEditPhone(!editPhone)
  }

  const handlePhone = () => {
    setEditPhone(!editPhone)
    handleUpdate(phone, userDetail.AREA, userDetail.CITY, userDetail.COUNTRY)
    setPhone(phone)
    toast.success('Phone added successfully.')
  }

  const handlePhoneChange = (e) => {
    setPhone(e.target.value)
  }

  const toggleEditAddress = () => setEditAddress(!editAddress)

  const handleConcatenateAddress = () => {
    if (!area || !city || !country) {
      toast.error('Please fill in all fields to add an address.')
    } else {
      setEditAddress(false)
      handleUpdate(userDetail.PHONE, area, city, country)
      setArea(area)
      setCity(city)
      setCountry(country)
      toast.success('Address added successfully.')
    }
  }

  return (
    <div className="cardContainer">
      <ToastContainer />
      <Card
        style={{
          width: '90%',
          height: 'auto',
          borderRadius: '16px',
        }}
      >
        <Card.Img
          variant="top"
          src={userDetail.PRO_URL ? userDetail.PRO_URL : defaultProfile}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            width: '120px',
            height: '120px',
            alignSelf: 'center',
            marginTop: '30px',
          }}
        />
        <Card.Body>
          <Card.Text style={{ textAlign: 'center' }}>
            <div onClick={changePic}>
              <span
                className="material-symbols-outlined addProfilePic hoverEffect"
                style={{ position: 'relative', top: '-20px' }}
              >
                <span className="logo">edit</span>
                <span className="editPicture">Change Profile Picture</span>
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Card.Text>
          <Card.Title
            style={{
              textAlign: 'center',
              position: 'relative',
              top: '-30px',
            }}
          >
            <h4>{userDetail.NAME}</h4>
          </Card.Title>
          <Card.Text
            style={{
              textAlign: 'center',
              position: 'relative',
              top: '-30px',
            }}
          >
            <a href="#!">{userDetail.EMAIL}</a>
          </Card.Text>

          <Card.Text
            style={{
              textAlign: 'center',
              position: 'relative',
              top: '-37px',
            }}
          >
            {!editPhone ? (
              <span
                className="material-symbols-outlined addProfilePic hoverEffect"
                onClick={toggleEditPhone}
                style={{
                  position: 'relative',
                  top: '-5px',
                  cursor: 'pointer',
                }}
              >
                {!userDetail.PHONE && <span className="logo">add</span>}
                <span className="editPicture">
                  {userDetail.PHONE || 'Add Phone'}{' '}
                </span>
              </span>
            ) : (
              <div
                style={{
                  width: '25%',
                  margin: 'auto',
                  position: 'relative',
                  top: '5px',
                }}
              >
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="basic-addon1">Phone</InputGroup.Text>
                  <Form.Control
                    placeholder="Enter phone number"
                    aria-label="Phone number"
                    aria-describedby="basic-addon2"
                    value={phone}
                    onChange={handlePhoneChange}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePhone()
                      }
                    }}
                  />
                </InputGroup>
              </div>
            )}
            <span style={{ color: 'rgb(169, 168, 168)' }}>|</span>{' '}
            {!editAddress ? (
              <span
                className="material-symbols-outlined addProfilePic hoverEffect"
                onClick={toggleEditAddress}
                style={{
                  position: 'relative',
                  top: '-5px',
                  cursor: 'pointer',
                }}
              >
                {!(
                  userDetail.AREA &&
                  userDetail.CITY &&
                  userDetail.COUNTRY
                ) && <span className="logo">add</span>}
                <span className="editPicture">
                  {userDetail.AREA && userDetail.CITY && userDetail.COUNTRY
                    ? `${userDetail.AREA}, ${userDetail.CITY}, ${userDetail.COUNTRY}`
                    : 'Add Address'}{' '}
                </span>
              </span>
            ) : (
              <div
                style={{
                  width: '25%',
                  margin: 'auto',
                  position: 'relative',
                  top: '5px',
                }}
              >
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text>Address</InputGroup.Text>
                  <FormControl
                    placeholder="Area"
                    aria-label="Area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConcatenateAddress()
                    }}
                    style={{ width: '100%' }}
                  />
                  <FormControl
                    placeholder="City"
                    aria-label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConcatenateAddress()
                    }}
                    style={{ width: '100%' }}
                  />
                  <FormControl
                    placeholder="Country"
                    aria-label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConcatenateAddress()
                    }}
                    style={{ width: '100%' }}
                  />
                </InputGroup>
              </div>
            )}
          </Card.Text>
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="primary"
              className="recordBtn"
              onClick={goRecord}
              style={{
                position: 'relative',
                top: '-50px',
                fontSize: '0.9rem',
              }}
            >
              History
            </Button>
          </span>
          <Container
            style={{ textAlign: 'center', position: 'relative', top: '-20px' }}
          >
            <Row>
              <Col>
                <h5>123</h5>
                <text
                  style={{
                    fontSize: '14px',
                    color: 'gray',
                    position: 'relative',
                    top: '-5px',
                  }}
                >
                  Active Parking
                </text>
              </Col>
              <Col>
                <h5>123</h5>
                <text
                  style={{
                    fontSize: '14px',
                    color: 'gray',
                    position: 'relative',
                    top: '-5px',
                  }}
                >
                  Active Services
                </text>
              </Col>
              <Col>
                <h5>123</h5>
                <text
                  style={{
                    fontSize: '14px',
                    color: 'gray',
                    position: 'relative',
                    top: '-5px',
                  }}
                >
                  Active Rents
                </text>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>

      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          width: '90%',
        }}
      >
        <CardGroup>
          <Card
            className="hide-scrollbar show-scrollbar"
            style={{
              width: '25.5rem',
              height: '20rem',
              overflow: 'auto',
              borderTop: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
            }}
          >
            <Card.Header>
              <h4>Parking Info</h4>
            </Card.Header>
            <Card.Body>
              <Card.Title>Active Parking</Card.Title>
              {loading ? (
                <p>Loading...</p>
              ) : parkingInfo.length === 0 ? (
                <p>No active parking available.</p>
              ) : (
                <Card.Text>
                  {parkingInfo.map((carInfo, index) => (
                    <React.Fragment key={index}>
                      <li>
                        Car Number: <i>{' ' + carInfo.VEHICLENO}</i>
                      </li>
                      <li>
                        Car Type: <i>{' ' + carInfo.VEHICLETYPE}</i>
                      </li>
                      <li>
                        Car Color: <i>{' ' + carInfo.VEHICLE_COLOR}</i>
                      </li>
                      <li>
                        Car Model: <i>{' ' + carInfo.VEHICLE_MODEL}</i>
                      </li>
                      <li>
                        Car Parking Slot: <i>{' ' + carInfo.GARAGEID}</i>
                      </li>
                      <br />
                    </React.Fragment>
                  ))}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
          <Card
            className="hide-scrollbar show-scrollbar"
            style={{
              width: '25.5rem',
              height: '20rem',
              overflow: 'auto',
              borderTop: 'none',
              borderBottom: 'none',
            }}
          >
            <Card.Header>
              <h4>Shorterm Care Services</h4>
            </Card.Header>
            <Card.Body>
              <Card.Title>Active Services</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card
            className="hide-scrollbar show-scrollbar"
            style={{
              width: '25.5rem',
              height: '20rem',
              overflow: 'auto',
              borderTop: 'none',
              borderBottom: 'none',
            }}
          >
            <Card.Header>
              <h4>Longterm Care Services</h4>
            </Card.Header>
            <Card.Body>
              <Card.Title>Active Services</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card
            className="hide-scrollbar show-scrollbar"
            style={{
              width: '25.5rem',
              height: '20rem',
              overflow: 'auto',
              borderRight: 'none',
              borderBottom: 'none',
              borderTop: 'none',
            }}
          >
            <Card.Header>
              <h4>Rented Car</h4>
            </Card.Header>
            <Card.Body>
              <Card.Title>Active Rents</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </CardGroup>
      </div>
      <br />
    </div>
  )
}

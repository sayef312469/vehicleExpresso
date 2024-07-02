import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBIcon,
} from 'mdb-react-ui-kit'
import Card from 'react-bootstrap/Card'
import { useAuthContext } from '../hooks/useAuthContext'
import defaultProfile from '../img/defaultProfile.png'

export default function Profile() {
  const [userDetail, setUserDetail] = useState('')
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
            alert('Profile picture uploaded successfully!')
          } else {
            throw new Error('Invalid response from server')
          }
        } catch (error) {
          console.error('Network error:', error)
          alert('Error uploading file. Please try again later.')
        }
      } catch (error) {
        console.error('File selection was cancelled or failed', error)
        alert('File selection was cancelled or failed. Please try again.')
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

  return (
    <div className="vh-100">
      <MDBContainer className="container py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="4">
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="text-center">
                <div className="mt-3 mb-4">
                  <MDBCardImage
                    src={
                      userDetail.PRO_URL ? userDetail.PRO_URL : defaultProfile
                    }
                    className="rounded-circle"
                    fluid
                    style={{ width: '100px', height: '100px' }}
                  />
                  <div onClick={changePic}>
                    <span className="material-symbols-outlined addProfilePic">
                      <span className="logo">edit</span>
                      <span className="editPicture">
                        Change Profile Picture
                      </span>
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
                <MDBTypography tag="h4" className="name">
                  {userDetail.NAME}
                </MDBTypography>
                <MDBCardText className="text-muted mb-4">
                  {userDetail.PHONE || 'Add Phone'}{' '}
                  <span className="mx-2">|</span>{' '}
                  <a href="#!">{userDetail.EMAIL}</a>
                </MDBCardText>
                <div className="mb-4 pb-2">
                  <MDBBtn outline floating>
                    <MDBIcon fab icon="facebook" size="lg" />
                  </MDBBtn>
                  <MDBBtn outline floating className="mx-1">
                    <MDBIcon fab icon="twitter" size="lg" />
                  </MDBBtn>
                  <MDBBtn outline floating>
                    <MDBIcon fab icon="skype" size="lg" />
                  </MDBBtn>
                </div>
                <MDBBtn
                  rounded
                  size="lg"
                  className="recordBtn"
                  onClick={goRecord}
                >
                  History
                </MDBBtn>
                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                  <div>
                    <MDBCardText className="mb-1 h5">8471</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Wallets Balance
                    </MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">8512</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Followers
                    </MDBCardText>
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5">4751</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Total Transactions
                    </MDBCardText>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="cardContainer">
        <Card
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
            borderRadius: '16px',
            overflow: 'auto',
          }}
        >
          <Card.Header>
            <h4>Parking Info</h4>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : parkingInfo.length === 0 ? (
              <p>No active parking available.</p>
            ) : (
              <Card.Text>
                {parkingInfo.map((carInfo, index) => (
                  <React.Fragment key={index}>
                    <li>Car Number: {carInfo.VEHICLENO}</li>
                    <li>Car Type: {carInfo.VEHICLETYPE}</li>
                    <li>Car Color: {carInfo.VEHICLE_COLOR}</li>
                    <li>Car Model: {carInfo.VEHICLE_MODEL}</li>
                    <li>Car Parking Slot: {carInfo.GARAGEID}</li>
                    <br />
                  </React.Fragment>
                ))}
              </Card.Text>
            )}
          </Card.Body>
        </Card>
        <br />
        <Card
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
            borderRadius: '16px',
            overflow: 'auto',
          }}
        >
          <Card.Header>
            <h4>Longterm Vehicle Care</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>Active Services</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <Card
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
            borderRadius: '16px',
            overflow: 'auto',
          }}
        >
          <Card.Header>
            <h4>Shorterm Vehicle Care</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>Active Services</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <Card
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
            borderRadius: '16px',
            overflow: 'auto',
          }}
        >
          <Card.Header>
            <h5>Rented Car</h5>
          </Card.Header>
          <Card.Body>
            <Card.Title>Active Rents</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
      </div>
    </div>
  )
}

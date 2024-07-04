import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Card, Button, CardGroup } from 'react-bootstrap'
import { useAuthContext } from '../hooks/useAuthContext'
import defaultProfile from '../img/defaultProfile.png'

export default function ProfileTest() {
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
    <div className="cardContainer">
      <Card
        style={{
          width: '90%',
          height: '30rem',
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
              top: '-45px',
            }}
          >
            <span
              className={`material-symbols-outlined addProfilePic ${
                !userDetail.PHONE ? 'hoverEffect' : ''
              }`}
              style={{
                position: 'relative',
                top: '-5px',
              }}
            >
              <span className="logo">add</span>
              <span className="editPicture">
                {userDetail.PHONE || 'Add Phone'}{' '}
              </span>
            </span>
            <span style={{ color: 'rgb(169, 168, 168)' }}>|</span>{' '}
            <span
              className={`material-symbols-outlined addProfilePic ${
                !userDetail.PHONE ? 'hoverEffect' : ''
              }`}
              style={{
                position: 'relative',
                top: '-5px',
              }}
            >
              <span className="logo">add</span>
              <span className="editPicture">
                {userDetail.PHONE || 'Add Address'}{' '}
              </span>
            </span>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              position: 'relative',
              top: '-25px',
            }}
          >
            <Card.Text style={{ textAlign: 'center' }}>
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
            </Card.Text>
            <Card.Text style={{ textAlign: 'center' }}>
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
            </Card.Text>
            <Card.Text style={{ textAlign: 'center' }}>
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
            </Card.Text>
          </div>
        </Card.Body>
      </Card>

      <CardGroup style={{ borderRadius: '16px', width: '90%' }}>
        <Card
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
            overflow: 'auto',
          }}
        >
          <Card.Header>
            <h4>Parking Info</h4>
            <br />
          </Card.Header>
          <Card.Body>
            <Card.Title>Active Parking</Card.Title>
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
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
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
        <Card
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
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
        <Card
          border="dark"
          className="hide-scrollbar show-scrollbar"
          style={{
            width: '25.5rem',
            height: '20rem',
            overflow: 'auto',
          }}
        >
          <Card.Header>
            <h4>Rented Car</h4>
            <br />
          </Card.Header>
          <Card.Body>
            <Card.Title>Active Rents</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </CardGroup>
      <br />
    </div>
  )
}

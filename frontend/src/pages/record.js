import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import '../styles/record.css'

const RecordHistory = () => {
  const [records, setRecords] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/record')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setRecords(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleUserClick = (user) => {
    if (user.USERID >= 100) {
      setSelectedUser(user)
      setIsModalOpen(true)
    } else {
      toast.error('You cannot change the role of an Admin')
    }
  }

  const handleConfirm = async () => {
    const userid = selectedUser.USERID - 100
    try {
      const response = await axios.put(
        `http://localhost:4000/api/user/recordUpdate/${selectedUser.USERID}`,
        {
          userid,
        },
      )
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.USERID === selectedUser.USERID
            ? { ...record, USERID: userid }
            : record,
        ),
      )
      toast.success("User's role changed successfully")
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const renderTooltip = (props) => (
    <Tooltip
      id="button-tooltip"
      {...props}
    >
      Change role
    </Tooltip>
  )

  return (
    <div class="first">
      <h1 class="second">Users Record</h1>
      <div class="third">
        <div style={{ padding: '1.5rem' }}>
          <h2 class="fourth">Users & Admins</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {records.map((record) => (
              <li
                className="fifth"
                key={record.USERID}
              >
                <div>
                  <h3
                    className="sixth"
                    style={{ textAlign: 'left' }}
                  >
                    {record.NAME}
                  </h3>
                  <p className="seventh">Email: {record.EMAIL}</p>
                  <p className="seventh">Phone: {record.PHONE}</p>
                  <p className="seventh">
                    Address: {record.AREA}, {record.CITY}, {record.COUNTRY}
                  </p>
                </div>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 0, hide: 0 }}
                  overlay={renderTooltip}
                >
                  <div style={{ textAlign: 'right', height: 'fit-content' }}>
                    <span
                      style={{
                        color: record.USERID >= 100 ? '#16a34a' : '#dc2626',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleUserClick(record)}
                    >
                      {record.USERID >= 100 ? 'User' : 'Admin'}
                    </span>
                  </div>
                </OverlayTrigger>
              </li>
            ))}
          </ul>

          <Modal
            show={isModalOpen}
            onHide={handleCancel}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Change User Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>Do you want to change this user to Admin?</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCancel}
              >
                No
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
          <ToastContainer />
        </div>
      </div>
    </div>
  )
}

export default RecordHistory

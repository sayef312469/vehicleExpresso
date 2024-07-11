import React, { useEffect, useState } from 'react'
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr'
import Notice from '../components/Notice'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNotificationContext } from '../hooks/useNotificationContext'

const UserParkHistory = () => {
  const { user } = useAuthContext()
  const [notices, setNotices] = useState(null)
  const { dispatch } = useNotificationContext()
  const [offset, setOffset] = useState(0)

  const handleOffsetR = (e) => {
    e.preventDefault()
    if (!notices) {
      return
    }
    setOffset(offset + 10)
    console.log('offset R: ', offset)
  }

  const handleOffsetL = (e) => {
    e.preventDefault()
    setOffset(Math.max(0, offset - 10))
    console.log('offset L: ', offset)
  }

  useEffect(() => {
    if (!user) {
      return
    }

    console.log('offset Effect: ', offset)

    const getNotice = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/getnotice',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userid: user.id,
            offset,
          }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        setNotices(data)
      } else{
        setNotices(null)
      }
    }

    const setReadNotice = async () => {
      fetch('http://localhost:4000/api/parking/setreadnotice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: user.id,
        }),
      }).then(() => dispatch({ type: 'READ' }))
    }

    getNotice()
    if (offset === 0) {
      setReadNotice()
    }
  }, [user, dispatch, offset])
  return (
    <div className="userParkHistory">
      <div className="allNotices">
        <h4>Your Notifications</h4>
        <hr />
        {notices &&
          notices.map((notice) => (
            <Notice
              key={notice.SERVICEID}
              notice={notice}
            />
          ))}

        <div className="prevNextBtn">
          <div onClick={handleOffsetL}>
            <GrLinkPrevious />
          </div>
          <div onClick={handleOffsetR}>
            <GrLinkNext />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserParkHistory

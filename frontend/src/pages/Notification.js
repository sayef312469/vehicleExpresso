import React, { useEffect, useState } from 'react'
import Notice from '../components/Notice'
import { useAuthContext } from '../hooks/useAuthContext'

const UserParkHistory = () => {
  const { user } = useAuthContext()
  const [notices, setNotices] = useState(null)

  useEffect(() => {
    if (!user) {
      return
    }
    const getNotice = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/getnotice',
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
        setNotices(data)
      }
    }

    const setReadNotice = async () => {
      await fetch('http://localhost:4000/api/parking/setreadnotice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: user.id,
        }),
      })
    }

    getNotice()
    setReadNotice()
  }, [user])
  return (
    <div className="userParkHistory">
      <div className="histories">
        <h4>Your Notifications</h4>
        {notices &&
          notices.map((notice) => (
            <Notice
              key={notice.SERVICEID}
              notice={notice}
            />
          ))}
      </div>
    </div>
  )
}

export default UserParkHistory

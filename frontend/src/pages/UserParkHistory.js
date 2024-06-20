import React, { useEffect, useState } from 'react'
import ShowUserParkHistory from '../components/ShowUserParkHistory'
import { useAuthContext } from '../hooks/useAuthContext'

const UserParkHistory = () => {
  const { user } = useAuthContext()
  const [histories, setHistories] = useState(null)

  useEffect(() => {
    if (!user) {
      return
    }
    const getHistory = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/userparkhistory',
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
        setHistories(data)
      }
    }
    getHistory()
  }, [setHistories, user])
  return (
    <div className="userParkHistory">
      <div className="histories">
        <h4>Your Park History</h4>
        <hr />
        {histories &&
          histories.map((history) => (
            <ShowUserParkHistory
              history={history}
              key={history}
            />
          ))}
      </div>
    </div>
  )
}

export default UserParkHistory

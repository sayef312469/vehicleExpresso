import { useState } from 'react'

const DuePark = ({ due }) => {
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch(
      'http://localhost:4000/api/parking/notifyparkfordue',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garageid: due.GARAGEID,
          due: due.TOTAL_DUE,
          da: due.PAY_DAY,
        }),
      },
    )

    const data = await response.json()
    if (response.ok) {
      setMsg(data.msg)
      setError(null)
    } else {
      setMsg(null)
      setError(data.error)
    }
  }
  return (
    <div className="duePark">
      <div class="dateLine">
        <div
          className="noticeTime"
          title="Due Time"
        >
          <span>{due.PAY_DAY}</span>
        </div>
      </div>

      <div
        className="historyInfo"
        title="Garage Info"
      >
        <span className="material-symbols-outlined">local_parking</span>
        <span>
          {due.NAME}, {due.AREA}, {due.CITY}, {due.COUNTRY}
        </span>
      </div>
      <div
        className="historyInfo"
        title="Total Amount"
      >
        <span className="material-symbols-outlined">attach_money</span>
        <span>{due.TOTAL_AMOUNT}</span>
      </div>
      <div
        className="historyInfo"
        title="Total Due"
      >
        <span className="material-symbols-outlined">paid</span>
        <span>{due.TOTAL_DUE}</span>
      </div>
      <form onSubmit={handleSubmit}>
        <button>
          <span className="material-symbols-outlined">send_money</span>
          Send Notice
        </button>
        {msg && <div className="msg">{msg}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
export default DuePark

import { useEffect, useState } from 'react'
import DayData from '../components/DayData'
import ShowUserParkHistory from '../components/ShowUserParkHistory'
import { useAuthContext } from '../hooks/useAuthContext'
import { useParksContext } from '../hooks/useParksContext'

const ParkHistory = () => {
  const { user } = useAuthContext()
  const [histories, setHistories] = useState(null)
  const { parks, dispatch } = useParksContext()
  const [error, setError] = useState(null)
  const [gid, setGid] = useState(null)
  const [vtype, setVtype] = useState(null)
  const [msg, setMsg] = useState(null)
  const [email, setEmail] = useState(null)
  const [stype, setStype] = useState('')
  const [hisDay, setHisDay] = useState('')
  const [dayData, setDayData] = useState(null)
  const [gidDay, setGidDay] = useState(null)
  const [loadingDayData, setLoadingDayData] = useState(null)
  const [errDayData, setErrDayData] = useState(null)

  useEffect(() => {
    console.log('Rent info: ', user)
    const searchParksEmail = async () => {
      if (!user) {
        return
      }
      const response = await fetch(
        'http://localhost:4000/api/parking/searchparksusingemail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        dispatch({ type: 'SET_PARKS', payload: data })
      } else {
        setError(data.error)
      }
    }
    searchParksEmail()
  }, [user, dispatch])

  useEffect(() => {
    if (!user) {
      return
    }
    const getHistory = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/parkhistory',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userid: user.id,
            garageid: null,
            vehicletype: null,
            servicetype: null,
            email,
          }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        console.log(data)
        setHistories(data)
      } else {
        setError(data.error)
        setMsg(null)
      }
    }
    getHistory()
  }, [user, email])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(
      'http://localhost:4000/api/parking/parkhistory',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: user.id,
          garageid: gid,
          vehicletype: vtype,
          servicetype: stype,
          email,
        }),
      },
    )

    const data = await response.json()
    if (response.ok) {
      console.log(data)
      setHistories(data)
      setMsg('Filter Success')
      setError(null)
    } else {
      setMsg(null)
      setError(data.error)
    }
  }

  const getQueryDay = async (e) => {
    e.preventDefault()

    setLoadingDayData('Loading...')
    const response = await fetch('http://localhost:4000/api/parking/daydata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        garageid: gidDay,
        hisDay,
      }),
    })

    const data = await response.json()
    if (response.ok) {
      setDayData(data)
      setLoadingDayData(null)
      setErrDayData(null)
    } else {
      setErrDayData(data.error)
      setLoadingDayData(null)
      setDayData(null)
    }
  }

  return (
    <div className="userParkHistory">
      <div className="queryBoxHis">
        <form
          className="serachParkForm"
          onSubmit={handleSubmit}
        >
          <h4>Filter History</h4>
          <hr />
          <div className="input_box">
            <label>
              <span className="material-symbols-outlined">park</span>
            </label>
            <select
              value={gid}
              onChange={(e) => setGid(e.target.value)}
            >
              <option value="">Select Garage</option>
              {parks &&
                parks.map((park) => (
                  <option
                    value={park.GARAGEID}
                    key={park.GARAGEID}
                  >
                    {park.NAME}, {park.AREA}, {park.CITY}, {park.COUNTRY}
                  </option>
                ))}
            </select>
          </div>
          <div className="input_box">
            <label>
              <span className="material-symbols-outlined">
                format_list_numbered_rtl
              </span>
            </label>
            <select
              value={vtype}
              onChange={(e) => setVtype(e.target.value)}
            >
              <option value="">Vehicle Type</option>
              <option value="CAR">CAR</option>
              <option value="JEEP">JEEP</option>
              <option value="BIKE">BIKE</option>
              <option value="MICRO">MICRO</option>
            </select>
          </div>

          <div className="input_box">
            <label>
              <span className="material-symbols-outlined">
                security_update_good
              </span>
            </label>
            <select
              value={stype}
              onChange={(e) => setStype(e.target.value)}
            >
              <option value="">Select Service</option>
              <option value="SHORT">SHORT</option>
              <option value="LONG">LONG</option>
            </select>
          </div>

          <div className="input_box">
            <label>
              <span className="material-symbols-outlined">alternate_email</span>
            </label>
            <input
              type="text"
              placeholder="Vechicle Owner Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <button>
            <span className="material-symbols-outlined">history</span>
            Get History
          </button>
          {error && <div className="error">{error}</div>}
          {msg && <div className="msg">{msg}</div>}
        </form>

        <form
          className="dateSelect"
          onSubmit={getQueryDay}
        >
          <h4>Query for a Particular Date</h4>
          <hr />
          <div className="input_box">
            <label>
              <span className="material-symbols-outlined">park</span>
            </label>
            <select
              value={gidDay}
              onChange={(e) => setGidDay(e.target.value)}
            >
              <option value="">Select Garage</option>
              {parks &&
                parks.map((park) => (
                  <option
                    value={park.GARAGEID}
                    key={park.GARAGEID}
                  >
                    {park.NAME}, {park.AREA}, {park.CITY}, {park.COUNTRY}
                  </option>
                ))}
            </select>
          </div>
          <div className="input_box">
            <input
              type="date"
              value={hisDay}
              onChange={(e) => setHisDay(e.target.value)}
            />
          </div>
          <button>
            <span className="material-symbols-outlined">query_stats</span>
            Get Query
          </button>
          {loadingDayData && <div className="msg">{loadingDayData}</div>}
          {errDayData && <div className="error">{errDayData}</div>}
          {dayData && <DayData data={dayData} />}
        </form>
      </div>
      <div className="histories">
        <h4>Your Garage Histories</h4>
        <hr />
        {histories &&
          histories.map((history) => (
            <ShowUserParkHistory
              key={history.SERVICEID}
              history={history}
            />
          ))}
      </div>
    </div>
  )
}

export default ParkHistory

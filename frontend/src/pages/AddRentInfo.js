import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useParksContext } from '../hooks/useParksContext'

const AddRentInfo = () => {
  const { user } = useAuthContext()
  const [gid, setGid] = useState(null)
  const [vtype, setVtype] = useState(null)
  const [srentCost, setSRentCost] = useState(null)
  const [lrentCost, setLRentCost] = useState(null)
  const [lshort, setLShort] = useState(null)
  const [llong, setLLong] = useState(null)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const { parks, dispatch } = useParksContext()

  console.log('RentCost: ', srentCost)

  console.log('Parks: ', parks)
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
    if (!gid || !vtype) {
      return
    }
    const getCost = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/getrentcost',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ garageid: gid, vehicletype: vtype }),
        },
      )
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        setSRentCost(data.COSTSHORT)
        setLRentCost(data.COSTLONG)
        setLShort(data.LEFTSHORT)
        setLLong(data.LEFTLONG)
      } else {
        setError(data.error)
      }
    }
    getCost()
  }, [gid, vtype])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(
      'http://localhost:4000/api/parking/setrentcost',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          garageid: gid,
          vehicletype: vtype,
          costshort: srentCost,
          costlong: lrentCost,
          leftshort: lshort,
          leftlong: llong,
        }),
      },
    )

    const data = response.json()
    if (!response.ok) {
      setError(data.error)
    } else {
      setError(null)
      setMsg('Costs Successfully Updated')
    }
  }

  return (
    <div className="setCost">
      <form
        className="serachParkForm"
        onSubmit={handleSubmit}
      >
        <h3>Set Costs & Abilities</h3>
        <label>Select Garage:</label>
        <select
          value={gid}
          onChange={(e) => setGid(e.target.value)}
        >
          <option value="">Select Garage</option>
          {parks &&
            parks.map((park) => (
              <option value={park.GARAGEID}>
                {park.NAME}, {park.AREA}, {park.CITY}, {park.COUNTRY}
              </option>
            ))}
        </select>
        <label>Vehicle type:</label>
        <select
          value={vtype}
          onChange={(e) => setVtype(e.target.value)}
        >
          <option value="">Select Vehicle</option>
          <option value="CAR">CAR</option>
          <option value="JEEP">JEEP</option>
          <option value="BIKE">BIKE</option>
          <option value="MICRO">MICRO</option>
        </select>
        <label>Short Term Cost:</label>
        <input
          type="text"
          onChange={(e) => setSRentCost(e.target.value)}
          value={srentCost}
        />
        <label>Long Term Cost:</label>
        <input
          type="text"
          onChange={(e) => setLRentCost(e.target.value)}
          value={lrentCost}
        />
        <label>Left {vtype} (short):</label>
        <input
          type="text"
          onChange={(e) => setLShort(e.target.value)}
          value={lshort}
        />
        <label>Left {vtype} (long):</label>
        <input
          type="text"
          onChange={(e) => setLLong(e.target.value)}
          value={llong}
        />
        <br />
        <button>Update Cost</button>
        {error && <div className="error">{error}</div>}
        {msg && <div className="msg">{msg}</div>}
      </form>
    </div>
  )
}

export default AddRentInfo

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useParksContext } from '../hooks/useParksContext'

const VehicleEntryExit = () => {
  const { user } = useAuthContext()
  const [vehicleNo, setVehicleNo] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [gid, setGid] = useState(null)
  const [srentCost, setSRentCost] = useState(null)
  const [lrentCost, setLRentCost] = useState(null)
  const [lshort, setLShort] = useState(null)
  const [llong, setLLong] = useState(null)
  const [stype, setStype] = useState(null)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [entryAmount, setEntryAmount] = useState(0)
  const [gidExit, setGidExit] = useState(null)
  const [vehicleNoExit, setVehicleNoExit] = useState('')
  const [exitAmount, setExitAmount] = useState(0)
  const [exitData, setExitData] = useState(null)
  const { parks, dispatch } = useParksContext()
  const [errorExit, setErrorExit] = useState(null)
  const [msgExit, setMsgExit] = useState(null)

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
    if (!gid || !vehicleType) {
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
          body: JSON.stringify({ garageid: gid, vehicletype: vehicleType }),
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
  }, [gid, vehicleType])

  useEffect(() => {
    if (vehicleNo.length === 0) {
      setError(null)
      return
    }
    const getVType = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/getvehicle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json',
          },
          body: JSON.stringify({ vehicleno: vehicleNo }),
        },
      )
      const data = await response.json()
      if (response.ok) {
        setError(null)
        console.log(data)
        setMsg(
          data.VEHICLE_COMPANY +
            ' ' +
            data.VEHICLE_MODEL +
            '(' +
            data.VEHICLE_COLOR +
            ')' +
            ', Owner: ' +
            data.NAME,
        )
        setVehicleType(data.VEHICLETYPE)
      } else {
        setError(data.error)
        setMsg(null)
        setVehicleType('')
      }
    }
    getVType()
  }, [vehicleNo])

  useEffect(() => {
    if (!gidExit || !vehicleNoExit) {
      return
    }
    const getVType = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/getexitdata',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json',
          },
          body: JSON.stringify({ garageid: gidExit, vehicleno: vehicleNoExit }),
        },
      )
      const data = await response.json()
      if (response.ok) {
        setErrorExit(null)
        console.log(data)
        setExitData(data)
      } else {
        setErrorExit(data.error)
        setExitData(null)
      }
    }
    getVType()
  }, [gidExit, vehicleNoExit])

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('GID', gid)
    console.log('vehicleno', vehicleNo)
    console.log('vtype', vehicleType)
    console.log('service type: ', stype)

    const response = await fetch(
      'http://localhost:4000/api/parking/entryvehicle',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          vehicleno: vehicleNo,
          garageid: gid,
          payment_amount: entryAmount,
          servicetype: stype,
        }),
      },
    )
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      setMsg('Vehicle entry done')
      setError(null)
      if (stype === 'SHORT') {
        setLShort(lshort - 1)
      } else {
        setLLong(llong - 1)
      }
    } else {
      setMsg(null)
      setError(data.error)
    }
  }

  const handleExit = async (e) => {
    e.preventDefault()

    const response = await fetch(
      'http://localhost:4000/api/parking/exitvehicle',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          vehicleno: vehicleNoExit,
          garageid: gidExit,
          servicetype: exitData.SERVICETYPE,
          total_amount: exitData.PAID + exitData.COST,
          paid: Number(exitAmount) + exitData.PAID,
        }),
      },
    )
    const data = await response.json()
    if (response.ok) {
      setErrorExit(null)
      setMsgExit('Exit Success')

      if (exitData.SERVICETYPE === 'SHORT') {
        setLShort(lshort + 1)
      } else {
        setLLong(llong + 1)
      }

      let parkName = ''

      parks.forEach((park) => {
        if (park.GARAGEID === Number(gidExit)) {
          parkName = park.NAME
        }
      })

      const doc = new jsPDF()

      doc.setFontSize(18)
      doc.text(parkName, 70, 20)
      doc.setFontSize(14)
      doc.text('Vehicle exit details', 80, 30)

      doc.text(' ', 20, 40)

      const rows = [
        ['Owner', exitData.NAME],
        ['Vehicle Type', exitData.VEHICLETYPE],
        ['Service Type', exitData.SERVICETYPE],
        ['Start Time', exitData.ST_TIME],
        ['End Time', exitData.END_TIME],
        ['Per Unit Cost', exitData.PER_UNIT_COST],
        ['Total Amout', exitData.PAID + exitData.COST],
        ['Paid', Number(exitAmount) + exitData.PAID],
        ['Due', exitData.COST - Number(exitAmount)],
      ]

      doc.autoTable({
        body: rows,
        startY: 40,
      })

      doc.save('details.pdf')
    } else {
      setErrorExit(data.error)
      setMsgExit(null)
    }
  }

  return (
    <div className="addVehicle">
      <form
        className="serachParkForm"
        onSubmit={handleSubmit}
      >
        <h3>Vehicle Entry</h3>
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
            <span className="material-symbols-outlined">bike_scooter</span>
          </label>
          <input
            type="text"
            placeholder="Vehicle No"
            onChange={(e) => setVehicleNo(e.target.value)}
            value={vehicleNo}
          />
        </div>
        <div className="input_box">
          <label>
            <span className="material-symbols-outlined">transportation</span>
          </label>
          <input
            type="text"
            placeholder="Vehicle Type"
            onChange={(e) => setVehicleType(e.target.value)}
            value={vehicleType}
            disabled="disabled"
          />
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
            <option
              value="SHORT"
              disabled={!lshort ? 'disables' : ''}
            >
              SHORT, Left({lshort}), Price({srentCost})
            </option>
            <option
              value="LONG"
              disabled={!llong ? 'disables' : ''}
            >
              LONG, Left({llong}), Price({lrentCost})
            </option>
          </select>
        </div>

        <div className="input_box">
          <label>
            <span className="material-symbols-outlined">payments</span>
          </label>
          <input
            type="text"
            placeholder="Pay Amount"
            onChange={(e) => setEntryAmount(e.target.value)}
            value={entryAmount}
          />
        </div>

        <button disabled={!stype ? 'disables' : ''}>
          <span className="material-symbols-outlined">download</span>Entry
          Vehicle
        </button>
        {error && <div className="error">{error}</div>}
        {msg && <div className="msg">{msg}</div>}
      </form>

      <form
        className="serachParkForm"
        onSubmit={handleExit}
      >
        <h3>Vehicle Exit</h3>
        <hr />
        <div className="input_box">
          <label>
            <span className="material-symbols-outlined">park</span>
          </label>
          <select
            value={gidExit}
            onChange={(e) => setGidExit(e.target.value)}
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
            <span className="material-symbols-outlined">bike_scooter</span>
          </label>
          <input
            type="text"
            placeholder="Vehicle No"
            onChange={(e) => setVehicleNoExit(e.target.value)}
            value={vehicleNoExit}
          />
        </div>

        <div className="input_box">
          <label>
            <span className="material-symbols-outlined">credit_card</span>
          </label>
          <input
            type="text"
            placeholder="Pay Amount"
            onChange={(e) => setExitAmount(e.target.value)}
            value={exitAmount}
          />
        </div>
        <button>
          <span className="material-symbols-outlined">upload</span>Exit Vehicle
        </button>
        {errorExit && <div className="error">{errorExit}</div>}
        {msgExit && <div className="msg">{msgExit}</div>}
        {exitData && (
          <div>
            <h5>Info about the vehicle</h5>
            <p>
              <strong>Owner:</strong> {exitData.NAME}
            </p>
            <p>
              <strong>Vehicle Type:</strong> {exitData.VEHICLETYPE}
            </p>
            <p>
              <strong>Service Type:</strong> {exitData.SERVICETYPE}
            </p>
            <p>
              <strong>Start Time:</strong> {exitData.ST_TIME}
            </p>
            <p>
              <strong>End Time:</strong> {exitData.END_TIME}
            </p>
            <p>
              <strong>Per Unit Cost:</strong> {exitData.PER_UNIT_COST} tk
            </p>
            <p>
              <strong>Paid:</strong> {exitData.PAID} tk
            </p>
            <p>
              <strong>Due:</strong> {exitData.COST} tk
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default VehicleEntryExit

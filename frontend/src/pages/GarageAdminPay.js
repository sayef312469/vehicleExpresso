import React, { useEffect, useState } from 'react'
import DuePark from '../components/DuePark'
import { useParksContext } from '../hooks/useParksContext'

const GarageAdminPay = () => {
  const [gid, setGid] = useState(null)
  const { parks, dispatch } = useParksContext()
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [payDay, setPayDay] = useState(null)
  const [totalAmount, setTotalAmount] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [givenAmount, setGivenAmount] = useState(null)
  const [dueParks, setDueParks] = useState(null)

  useEffect(() => {
    const searchParksEmail = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/getallparks',
      )

      const data = await response.json()
      if (response.ok) {
        dispatch({ type: 'SET_PARKS', payload: data })
        setError(null)
      } else {
        setError(data.error)
      }
    }
    searchParksEmail()
  }, [dispatch])

  useEffect(() => {
    const searchParksEmail = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/parksdueadmin',
      )

      const data = await response.json()
      if (response.ok) {
        setDueParks(data)
        setError(null)
      } else {
        setError(data.error)
      }
    }
    searchParksEmail()
  }, [])

  useEffect(() => {
    const getQueryDay = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/paymentdata',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            garageid: gid,
            payDay,
          }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        console.log('total pay: ', data.TOTAL_PAY)
        setTotalAmount(data.TOTAL_PAY)
      } else {
        setTotalAmount(null)
      }
    }

    const getGivenAmount = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/givenamount',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            garageid: gid,
            payDay,
          }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        setGivenAmount(data.GIVEN_AMOUNT)
      } else {
        setGivenAmount(null)
      }
    }

    getQueryDay()
    getGivenAmount()
  }, [gid, payDay])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(
      'http://localhost:4000/api/parking/garageadminpay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garageid: gid,
          paymentAmount,
          payDay,
        }),
      },
    )

    const data = await response.json()
    if (response.ok) {
      setMsg(data.msg)
      setGivenAmount(givenAmount + Number(paymentAmount))
      setError(null)
    } else {
      setMsg(null)
      setError(data.error)
    }
  }
  return (
    <div className="showDateAndData">
      <form
        className="dateSelect"
        onSubmit={handleSubmit}
      >
        <h4>Garage Payment for a Day</h4>
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
          <input
            type="date"
            value={payDay}
            onChange={(e) => setPayDay(e.target.value)}
          />
        </div>
        {totalAmount != null && (
          <div
            className="historyInfo"
            title="Park have to pay"
          >
            <div className="key">
              <span className="material-symbols-outlined">local_taxi</span>
              Total Amount
            </div>
            <div className="val">{totalAmount}</div>
          </div>
        )}

        {givenAmount != null && (
          <div
            className="historyInfo"
            title="Park have to pay"
          >
            <div className="key">
              <span className="material-symbols-outlined">
                currency_exchange
              </span>
              Due
            </div>
            <div className="val">{totalAmount - givenAmount}</div>
          </div>
        )}
        <div
          className="input_box"
          title="Short Term Cost"
        >
          <label>
            <span className="material-symbols-outlined">credit_card</span>
          </label>
          <input
            type="text"
            placeholder="Short Term Cost"
            onChange={(e) => setPaymentAmount(e.target.value)}
            value={paymentAmount}
            disabled={totalAmount === 0 ? 'disabled' : ''}
          />
        </div>
        <button>
          <span className="material-symbols-outlined">paid</span>
          Pay Amount
        </button>
        {error && <div className="error">{error}</div>}
        {msg && <div className="msg">{msg}</div>}
      </form>

      <div className="histories">
        <h4>Your Garage Histories</h4>
        {dueParks &&
          dueParks.map((due) => (
            <DuePark
              key={due.GARAGEID}
              due={due}
            />
          ))}
      </div>
    </div>
  )
}

export default GarageAdminPay

import React, { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuthContext } from '../hooks/useAuthContext'
import '../styles/user.css'

const CareUser = () => {
  const { user } = useAuthContext()
  const longtermRef = useRef(null)
  const shorttermRef = useRef(null)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [exit1, setExit1] = useState(true)
  const [exit2, setExit2] = useState(true)
  const url = `http://localhost:4000/api/care/user`
  const [no, setNo] = useState('')
  const [type, setType] = useState('')
  const [model, setModel] = useState('')
  const [company, setCompany] = useState('')
  const [color, setColor] = useState('')
  const [date, setDate] = useState('')
  const [repairtype, setRepairtype] = useState('')
  const [washtype, setWashtype] = useState('')
  const [repair, setRepair] = useState(false)
  const [wash, setWash] = useState(false)

  const HandleLongTerm = () => {
    setVisible1(!visible1)
    setExit1(!exit1)
    if (visible2) HandleShortExit()
  }
  const HandleLongExit = () => {
    setVisible1(!visible1)
    setExit1(!exit1)
  }

  const HandleShortTerm = () => {
    setVisible2(!visible2)
    setExit2(!exit2)
    if (visible1) HandleLongTerm()
  }

  const HandleShortExit = () => {
    setVisible2(!visible2)
    setExit2(!exit2)
  }

  const HandleLongSubmit = () => {}

  const promise = (id) => {
    const resolveAfter3Sec = new Promise((resolve) => setTimeout(resolve, 3000))
    toast.promise(resolveAfter3Sec, {
      pending: 'Your service token is generating...',
      success: `Mr. ${user.name}, plz collect your Service token : ${id}`,
      error: 'Failure! Try again!',
    })
  }

  const warning = (notif) => toast.error(notif)

  const insertData = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleno: no,
          vehicleowner: user.id,
          vehicletype: type,
          vehiclemodel: model,
          vehiclecompany: company,
          vehiclecolor: color,
          date: date,
          repairtype: repairtype,
          washtype: washtype,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const jsonData = await response.json()
      promise(jsonData.service_id)
    } catch (err) {
      console.error('Error fetching data : ', err)
      warning(`Failure! Try again!`)
    }
  }

  const HandleShortSubmit = (e) => {
    e.preventDefault()
    if (!no || !type || !model || !company || !color || !date) {
      console.log('All fields must be filled up!')
    } else if (!repair && !wash) {
      console.log('Choose At least one service!')
    } else if (repair && !repairtype) {
      console.log('Describe the repair type!')
    } else if (wash && !washtype) {
      console.log('Describe the wash type!')
    } else {
      console.log('hello1')
      HandleShortExit()
      insertData()
      console.log('hello2')
    }
  }
  return (
    <div
      className="user"
      onClick={(e) => {
        if (e.target.className === 'user') {
          if (visible1) HandleLongExit()
          else if (visible2) HandleShortExit()
        }
      }}
    >
      <h3>Book for your desired service now!</h3>
      <div className="buttons">
        <button onClick={HandleLongTerm}>Longterm Vehicle care</button>
        <button onClick={HandleShortTerm}>Shortterm Vehicle care</button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {visible1 && !exit1 && (
        <form
          ref={longtermRef}
          className="popup"
        >
          <button
            className="exit"
            onClick={HandleLongExit}
          >
            X
          </button>
          <fieldset>
            <legend>LONGTERM CARE</legend>
            <legend>ENTER YOUR VEHICLE INFO</legend>
            <div className="block">
              <label htmlFor="vehicletype">Vehicle Type:</label>
              <input
                type="text"
                id="vehicletype"
                name="vehicletype"
              />
            </div>
            <div className="block">
              <label htmlFor="vehiclemodel">Vehicle Model:</label>
              <input
                type="text"
                id="vehiclemodel"
                name="vehiclemodel"
              />
            </div>
            <div className="block">
              <label htmlFor="vehiclecompany">Vehicle Company:</label>
              <input
                type="text"
                id="vehiclecompany"
                name="vehiclecompany"
              />
            </div>
            <div className="block">
              <label htmlFor="vehiclecolor">Vehicle Color:</label>
              <input
                type="text"
                id="vehiclecolor"
                name="vehiclecolor"
              />
            </div>
            <div className="block">
              <label htmlFor="serviceid">Service ID:</label>
              <input
                type="text"
                id="serviceid"
                name="serviceid"
                placeholder="(For Old Customers)"
              />
            </div>
            <legend>Enter your desired service:</legend>
            <div className="check">
              <input
                type="checkbox"
                id="vehiclerepair"
                name="servicetype"
                value="repair"
              ></input>
              <label htmlFor="vehiclerepair">Vehicle Repair</label>
              <label htmlFor="repairtype">Repair Type:</label>
              <textarea
                id="repairtype"
                name="repairtype"
                className="description"
              ></textarea>
            </div>
            <div className="check">
              <input
                type="checkbox"
                id="vehiclewash"
                name="servicetype"
                value="wash"
              />
              <label htmlFor="vehiclewash">Vehicle Wash</label>
              <label htmlFor="washtype">Wash Type:</label>
              <textarea
                id="washtype"
                name="washtype"
                className="description"
              ></textarea>
            </div>
            <button
              type="submit"
              className="submit"
              onClick={HandleLongSubmit}
            >
              Submit
            </button>
          </fieldset>
        </form>
      )}
      {visible2 && !exit2 && (
        <form
          ref={shorttermRef}
          className="popup"
        >
          <button
            className="exit"
            onClick={HandleShortExit}
          >
            X
          </button>
          <fieldset>
            <legend>
              (SHORTTERM CARE)<br></br>ENTER YOUR VEHICLE INFO
            </legend>
            <div className="block">
              <label htmlFor="vehicleno">Vehicle No:</label>
              <input
                type="text"
                id="vehicleno"
                name="vehicleno"
                onChange={(e) => {
                  setNo(e.target.value)
                }}
                value={no}
              />
            </div>
            <div className="block">
              <label htmlFor="vehicletype">Vehicle Type:</label>
              <input
                type="text"
                id="vehicletype"
                name="vehicletype"
                onChange={(e) => {
                  setType(e.target.value)
                }}
                value={type}
              />
            </div>
            <div className="block">
              <label htmlFor="vehiclemodel">Vehicle Model:</label>
              <input
                type="text"
                id="vehiclemodel"
                name="vehiclemodel"
                onChange={(e) => {
                  setModel(e.target.value)
                }}
                value={model}
              />
            </div>
            <div className="block">
              <label htmlFor="vehiclecompany">Vehicle Company:</label>
              <input
                type="text"
                id="vehiclecompany"
                name="vehiclecompany"
                onChange={(e) => {
                  setCompany(e.target.value)
                }}
                value={company}
              />
            </div>
            <div className="block">
              <label htmlFor="vehiclecolor">Vehicle Color:</label>
              <input
                type="text"
                id="vehiclecolor"
                name="vehiclecolor"
                onChange={(e) => {
                  setColor(e.target.value)
                }}
                value={color}
              />
            </div>
            <div className="block">
              <label htmlFor="servicedate">Service Date:</label>
              <input
                type="date"
                id="servicedate"
                name="servicedate"
                onChange={(e) => {
                  setDate(e.target.value)
                }}
                value={date}
              />
            </div>
            <legend>Enter your desired service:</legend>
            <div className="check">
              <input
                type="checkbox"
                id="vehiclerepair"
                name="servicetype"
                onChange={(e) => {
                  setRepair(e.target.checked)
                }}
                checked={repair}
              ></input>
              <label htmlFor="vehiclerepair">Vehicle Repair</label>
              <label htmlFor="repairtype">Repair Type:</label>
              <textarea
                id="repairtype"
                name="repairtype"
                className="description"
                onChange={(e) => {
                  setRepairtype(e.target.value)
                }}
                value={repairtype}
              ></textarea>
            </div>
            <div className="check">
              <input
                type="checkbox"
                id="vehiclewash"
                name="servicetype"
                onChange={(e) => {
                  setWash(e.target.checked)
                }}
                checked={wash}
              />
              <label htmlFor="vehiclewash">Vehicle Wash</label>
              <label htmlFor="washtype">Wash Type:</label>
              <textarea
                id="washtype"
                name="washtype"
                className="description"
                onChange={(e) => {
                  setWashtype(e.target.value)
                }}
                value={washtype}
              ></textarea>
            </div>
            <button
              type="submit"
              className="submit"
              onClick={HandleShortSubmit}
            >
              Submit
            </button>
          </fieldset>
        </form>
      )}
      <div>
        <span>
          | Bills
          |______________________________________________________________________|History|
        </span>
      </div>
    </div>
  )
}

export default CareUser

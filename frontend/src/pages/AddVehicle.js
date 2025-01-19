import React, { useState } from 'react'

const AddVehicle = () => {
  const [email, setEmail] = useState(null)
  const [vehicleNo, setVehicleNo] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleCompany, setVehicleCompany] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch(
      'http://localhost:4000/api/parking/addvehicle',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          email,
          vehicleno: vehicleNo,
          vehicletype: vehicleType,
          vehicle_model: vehicleModel,
          vehicle_company: vehicleCompany,
          vehicle_color: vehicleColor,
        }),
      },
    )
    const data = await response.json()
    console.log(response)

    if (response.ok) {
      setError(null)
      setMsg('Vehicle added successfully')
    } else {
      setError(data.error)
      setMsg(null)
    }
  }

  return (
    <div className="addVehicle">
      <form
        className="serachParkForm"
        onSubmit={handleSubmit}
      >
        <h4>Insert Vehicle</h4>
        <hr />
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
            <span className="material-symbols-outlined">directions_car</span>
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">Select Vehicle Type</option>
            <option value="CAR">CAR</option>
            <option value="JEEP">JEEP</option>
            <option value="BIKE">BIKE</option>
            <option value="MICRO">MICRO</option>
          </select>
        </div>
        <div className="input_box">
          <label>
            <span className="material-symbols-outlined">tram</span>
          </label>
          <input
            type="text"
            placeholder="Vehicle Model"
            onChange={(e) => setVehicleModel(e.target.value)}
            value={vehicleModel}
          />
        </div>
        <div className="input_box">
          <label>
            <span className="material-symbols-outlined">factory</span>
          </label>
          <input
            type="text"
            placeholder="Vehicle Company"
            onChange={(e) => setVehicleCompany(e.target.value)}
            value={vehicleCompany}
          />
        </div>
        <div className="input_box">
          <label>
            <span className="material-symbols-outlined">palette</span>
          </label>
          <input
            type="text"
            placeholder="Vehicle Color"
            onChange={(e) => setVehicleColor(e.target.value)}
            value={vehicleColor}
          />
        </div>
        <button>
          <span className="material-symbols-outlined">add_to_queue</span>Add
          Vehicle
        </button>
        {error && <div className="error">{error}</div>}
        {msg && <div className="msg">{msg}</div>}
      </form>
    </div>
  )
}

export default AddVehicle

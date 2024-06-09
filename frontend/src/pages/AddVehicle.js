import { useState } from 'react'

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
        <label>Vechicle Owner Email: </label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <h4>Insert Vehicle</h4>
        <hr />

        <label>Vehicle No:</label>
        <input
          type="text"
          onChange={(e) => setVehicleNo(e.target.value)}
          value={vehicleNo}
        />
        <label>Vehicle Type:</label>
        <input
          type="text"
          onChange={(e) => setVehicleType(e.target.value)}
          value={vehicleType}
        />
        <label>Vehicle Model:</label>
        <input
          type="text"
          onChange={(e) => setVehicleModel(e.target.value)}
          value={vehicleModel}
        />
        <label>Vehicle Company:</label>
        <input
          type="text"
          onChange={(e) => setVehicleCompany(e.target.value)}
          value={vehicleCompany}
        />
        <label>Vehicle Color:</label>
        <input
          type="text"
          onChange={(e) => setVehicleColor(e.target.value)}
          value={vehicleColor}
        />
        <br />
        <button>Add Vehicle</button>
        {error && <div className="error">{error}</div>}
        {msg && <div className="msg">{msg}</div>}
      </form>
    </div>
  )
}

export default AddVehicle

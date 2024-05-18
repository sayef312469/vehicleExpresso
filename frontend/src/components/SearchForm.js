import { useEffect, useState } from 'react'
import { useParksContext } from '../hooks/useParksContext'

const SearchForm = () => {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [vehicletyp, setVehicletyp] = useState('')
  const [lon, setLon] = useState(null)
  const [lat, setLat] = useState(null)
  const [curLoc, setCurLoc] = useState(false)
  const [error, setError] = useState(null)
  const { dispatch } = useParksContext()

  useEffect(() => {
    dispatch({ type: 'CLEAR_PARKS' })
  }, [dispatch])

  const handleCheck = () => {
    setCurLoc(!curLoc)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (curLoc) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setError(null)
          const crd = pos.coords
          setLat(crd.latitude)
          setLon(crd.longitude)
          console.log(lon, lat)
        },
        () => {
          setError('Something went wrong')
        },
      )
    } else {
      const address = `${area}, ${city}, ${country}`

      const getloc = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=86dfeb373186498b815247be64b0a611`,
      )

      const data = await getloc.json()

      if (!getloc.ok) {
        setError('Something went wrong')
      } else {
        setError(null)
        setLon(data.features[0].properties.lon)
        setLat(data.features[0].properties.lat)
        console.log('through input: ', lon, lat)
      }
    }

    if (error == null) {
      const response = await fetch('http://localhost:4000/api/parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicletype: vehicletyp,
          longitude: lon,
          latitude: lat,
        }),
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_PARKS', payload: json })
      } else {
        setError(json.error)
      }
    }
  }

  return (
    <form
      className="serachParkForm"
      onSubmit={handleSubmit}
    >
      <h4>Search Parks With Vehicle Type</h4>
      <br />

      <div style={{ display: 'inline', marginBottom: '20px' }}>
        <input
          style={{ display: 'inline', width: '19px', marginRight: '10px' }}
          type="checkbox"
          onChange={handleCheck}
          value={curLoc}
        />
        Nearyby your location
      </div>
      <hr />

      <label>Country:</label>
      <input
        type="text"
        onChange={(e) => setCountry(e.target.value)}
        value={country}
        disabled={curLoc ? 'disabled' : ''}
      />
      <label>City:</label>
      <input
        type="text"
        onChange={(e) => setCity(e.target.value)}
        value={city}
        disabled={curLoc ? 'disabled' : ''}
      />
      <label>Area:</label>
      <input
        type="text"
        onChange={(e) => setArea(e.target.value)}
        value={area}
        disabled={curLoc ? 'disabled' : ''}
      />
      <br />
      <hr />
      <label>Vehicle type:</label>
      <select
        value={vehicletyp}
        onChange={(e) => setVehicletyp(e.target.value)}
      >
        <option value="select">Select Vehicle</option>
        <option value="A">(A) Motorcycle</option>
        <option value="AU">(AU) Truck, Van</option>
        <option value="BA">(BA) Inter-city bus</option>
        <option value="CHA">(CHA) Microbus</option>
        <option value="DA">(DA) Truck, Van</option>
        <option value="GA">(GA) Private car</option>
        <option value="GHA">(GHA) Jeep</option>
        <option value="HA">(HA) Motorcycle</option>
        <option value="JA">(JA) Minibus</option>
        <option value="JHA">(JHA) Coach bus</option>
        <option value="LA">(LA) Motorcycle</option>
        <option value="MA">(MA) Delivery van</option>
        <option value="NA">(NA) Truck, Van</option>
        <option value="PA">(PA) Taxicab</option>
        <option value="U">(U) Truck, Van</option>
      </select>

      <button>Search</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default SearchForm

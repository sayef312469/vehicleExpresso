import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useParksContext } from '../hooks/useParksContext'
/* eslint-disable react/prop-types */
import React from 'react'
const SearchForm = () => {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [vehicletyp, setVehicletyp] = useState('')
  const [lon, setLon] = useState(null)
  const [lat, setLat] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [curLoc, setCurLoc] = useState(false)
  const [error, setError] = useState(null)
  const { dispatch } = useParksContext()
  const [toastLoad, setToastLoad] = useState(null)

  useEffect(() => {
    dispatch({ type: 'CLEAR_PARKS' })
  }, [dispatch])

  const handleCheck = () => {
    setCurLoc(!curLoc)
  }

  useEffect(() => {
    if (!isLoading && toastLoad) {
      toast.dismiss(toastLoad)
      setToastLoad(null)
    }
  }, [isLoading, toastLoad])

  useEffect(() => {
    const searchP = async () => {
      if (error == null && lon && lat) {
        console.log('lon, lat before fetch: ', lon, lat)
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
          setLon(null)
          setLat(null)
          setIsLoading(false)
          toast.success('Loaded')
        } else {
          setError(json.error)
          setIsLoading(false)
          toast.error('Search Error')
        }
      }
    }
    searchP()
  }, [lon, lat, dispatch, vehicletyp, error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setToastLoad(toast.loading('Loading...'))

    if (curLoc) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setError(null)
          const crd = pos.coords
          setLat(() => crd.latitude)
          setLon(() => crd.longitude)
        },
        () => {
          setError('Something went wrong')
          setIsLoading(false)
          setLon(null)
          setLat(null)
        },
      )
    } else {
      if (!area || !city || !country) {
        setError('All field must be filled')
        setIsLoading(false)
        setLon(null)
        setLat(null)
        return
      }

      const address = `${area}, ${city}, ${country}`

      const getloc = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=86dfeb373186498b815247be64b0a611`,
      )

      const data = await getloc.json()

      if (!getloc.ok) {
        setError('Something went wrong')
        setLon(null)
        setLat(null)
      } else {
        setError(null)
        setLon(() => data.features[0].properties.lon)
        setLat(() => data.features[0].properties.lat)
        console.log('through input: ', lon, lat)
      }
    }
  }

  return (
    <form
      className="serachParkForm"
      onSubmit={handleSubmit}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        limit={1}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <h4>Search Parks With Vehicle Type</h4>
      <br />
      <div className="input_option">
        <input
          type="checkbox"
          onChange={handleCheck}
          value={curLoc}
        />
        Nearyby your location
      </div>
      <hr />
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">
            integration_instructions
          </span>
        </label>
        <input
          type="text"
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
          value={country}
          disabled={curLoc ? 'disabled' : ''}
        />
      </div>
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">home_pin</span>
        </label>
        <input
          type="text"
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
          value={city}
          disabled={curLoc ? 'disabled' : ''}
        />
      </div>
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">my_location</span>
        </label>
        <input
          type="text"
          placeholder="Area"
          onChange={(e) => setArea(e.target.value)}
          value={area}
          disabled={curLoc ? 'disabled' : ''}
        />
      </div>
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">directions_car</span>
        </label>
        <select
          value={vehicletyp}
          onChange={(e) => setVehicletyp(e.target.value)}
        >
          <option value="">Select Vehicle</option>
          <option value="CAR">CAR</option>
          <option value="JEEP">JEEP</option>
          <option value="BIKE">BIKE</option>
          <option value="MICRO">MICRO</option>
        </select>
      </div>
      <button>
        <span
          className="material-symbols-outlined"
          style={isLoading ? { color: 'purple' } : {}}
        >
          Search
        </span>
        <span>Search</span>
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default SearchForm

import { useEffect, useState } from 'react'
import ParkDetails from '../components/ParkInfo'
import { useParksContext } from '../hooks/useParksContext'

const AddParkAdmin = () => {
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [emailsForPark, setEmailsForPark] = useState([])
  const { parks, dispatch } = useParksContext()

  useEffect(() => {
    console.log(email)
    const searchParksEmail = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/searchparksusingemail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        dispatch({ type: 'SET_PARKS', payload: data })
      }
    }
    searchParksEmail()
  }, [email, dispatch])

  useEffect(() => {
    const serachEmailsforPark = async () => {
      const response = await fetch(
        'http://localhost:4000/api/parking/findemailsforpark',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country, city, area, name }),
        },
      )
      const data = await response.json()
      if (response.ok) {
        console.log(data)
        setEmailsForPark(data)
      }
    }
    serachEmailsforPark()
  }, [country, city, area, name])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const address = `${area}, ${city}, ${country}`

    fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=86dfeb373186498b815247be64b0a611`,
    )
      .then((geoloc) => geoloc.json())
      .then(async (data) => {
        setError(null)

        const response = await fetch(
          'http://localhost:4000/api/parking/addparkadmin',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              country,
              city,
              area,
              name,
              longitude: data.features[0].geometry.coordinates[0],
              latitude: data.features[0].geometry.coordinates[1],
            }),
          },
        )
        const json = await response.json()

        if (response.ok) {
          dispatch({ type: 'ADD_PARK', payload: json })

          const serachEmailsforPark = async () => {
            const response = await fetch(
              'http://localhost:4000/api/parking/findemailsforpark',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ country, city, area, name }),
              },
            )
            const data = await response.json()
            if (response.ok) {
              console.log(data)
              setEmailsForPark(data)
            }
          }
          serachEmailsforPark()
        } else {
          setError(json.error)
        }
      })
  }

  return (
    <div className="addParkAdmin">
      <form
        className="serachParkForm"
        onSubmit={handleSubmit}
      >
        <label>Park Administrator Email: </label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <h4>Insert Park</h4>
        <hr />

        <label>Country:</label>
        <input
          type="text"
          onChange={(e) => setCountry(e.target.value)}
          value={country}
        />
        <label>City:</label>
        <input
          type="text"
          onChange={(e) => setCity(e.target.value)}
          value={city}
        />
        <label>Area:</label>
        <input
          type="text"
          onChange={(e) => setArea(e.target.value)}
          value={area}
        />
        <label>Park Name:</label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <br />
        <button>Add</button>
        {error && <div className="error">{error}</div>}
      </form>

      <div className="parks">
        {email && (
          <div>
            <h3>Such parks where {email} is admin</h3>
            <hr />
            {parks && parks.map((park) => <ParkDetails park={park} />)}
          </div>
        )}
      </div>
      <div className="emailsForPark">
        {emailsForPark.length > 0 && (
          <div>
            <h3>Admins of the park</h3>
            <hr />
            {emailsForPark.map((email) => (
              <div className="adminList">
                <strong>
                  Username: {email.NAME}
                  <br />
                  Email: {email.EMAIL}
                </strong>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddParkAdmin

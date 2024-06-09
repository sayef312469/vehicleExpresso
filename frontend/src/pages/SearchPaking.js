import { useParksContext } from '../hooks/useParksContext'

import ParkDetails from '../components/ParkInfo'
import SearchForm from '../components/SearchForm'

const SearchParking = () => {
  const { parks } = useParksContext()

  return (
    <div className="searchParking">
      <SearchForm />
      <div className="parks">
        {parks && parks.map((park) => <ParkDetails park={park} />)}
        {!parks && <h4>No Parks</h4>}
      </div>
    </div>
  )
}

export default SearchParking

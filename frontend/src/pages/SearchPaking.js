import { useParksContext } from "../hooks/useParksContext";

import SearchForm from "../components/SearchForm";
import ParkDetails from "../components/ParkInfo";

const SearchParking = () => {
  const { parks, dispatch } = useParksContext();

  return (
    <div className="searchParking">
      <SearchForm />
      <div className="parks">
        {parks && parks.map((park) => <ParkDetails park={park} />)}
      </div>
    </div>
  );
};

export default SearchParking;

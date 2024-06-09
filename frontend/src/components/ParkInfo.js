const ParkDetails = ({ park }) => {
  return (
    <div className="parkDetails">
      <h4>{park.NAME}</h4>
      <p>
        {park.AREA}, {park.CITY}, {park.COUNTRY} <br />
        {park.VEHICLETYPE && (
          <div>
            <strong>Vehicle type: {park.VEHICLETYPE}</strong>
            <br />
            <strong>Short Term Ability: {park.LEFTSHORT}</strong>
            <br />
            <strong>Long Term Ability: {park.LEFTLONG}</strong>
            <br />
            <strong>Short Term Cost: {park.COSTSHORT}</strong>
            <br />
            <strong>Long Term Cost: {park.COSTLONG}</strong>
          </div>
        )}
      </p>
    </div>
  )
}

export default ParkDetails

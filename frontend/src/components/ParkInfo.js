const ParkDetails = ({ park }) => {
  return (
    <div className="parkDetails">
      <h4>{park.NAME}</h4>
      <p>
        {park.AREA}, {park.CITY}, {park.COUNTRY} <br />
        <strong>
          Vehicle type: {park.VEHICLENAME} ({park.VEHICLETYPE})
        </strong>
        <br />
        <strong>Ability: {park.LEFTVECHICLE}</strong>
        <br />
        <strong>Cost per hour: {park.PRICE}</strong>
      </p>
    </div>
  );
};

export default ParkDetails;

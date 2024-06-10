const ParkDetails = ({ park }) => {
  return (
    <div className="parkDetails">
      <div className="park_name">
        <h4>{park.NAME}</h4>
      </div>
      <div class="park_area">
        <span
          className="material-symbols-outlined"
          style={{ color: 'green' }}
        >
          Map
        </span>
        <span style={{ color: ' #347474' }}>
          {park.AREA}, {park.CITY}, {park.COUNTRY}
        </span>
      </div>
      {park.VEHICLETYPE && (
        <div className="parks_info">
          <strong title="Vehicle Type">
            <span
              className="material-symbols-outlined"
              style={{ color: '#142d4c' }}
            >
              local_taxi
            </span>{' '}
            {park.VEHICLETYPE}
          </strong>

          <strong title="Short Term Ability">
            <span
              className="material-symbols-outlined"
              style={park.LEFTSHORT ? { color: '#142d4c' } : { color: 'red' }}
            >
              car_crash
            </span>
            {park.LEFTSHORT}
          </strong>

          <strong title="Long Term Ability">
            <span
              className="material-symbols-outlined"
              style={park.LEFTLONG ? { color: '#142d4c' } : { color: 'red' }}
            >
              no_transfer
            </span>
            {park.LEFTLONG}
          </strong>

          <strong title="Short Term Cost">
            <span
              className="material-symbols-outlined"
              style={{ color: '#142d4c' }}
            >
              credit_card
            </span>
            {park.COSTSHORT}
          </strong>

          <strong title="Long Term Cost">
            <span
              className="material-symbols-outlined"
              style={{ color: '#142d4c' }}
            >
              payments
            </span>
            {park.COSTLONG}
          </strong>
        </div>
      )}
    </div>
  )
}

export default ParkDetails

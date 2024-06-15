const ShowUserParkHistory = ({ history }) => {
  return (
    <div className="showUserParkHistory">
      <div
        className="idnumber"
        title="Service ID"
      >
        <span className="material-symbols-outlined">tag</span>
        {history.SERVICEID}
      </div>
      <div
        className="historyInfo"
        title="Vehicle Info"
      >
        <span className="material-symbols-outlined">pedal_bike</span>
        <span>
          {history.VEHICLE_COMPANY} {history.VEHICLE_MODEL} (
          {history.VEHICLE_COLOR})
        </span>
      </div>
      {history.USERNAME && (
        <div
          className="historyInfo"
          title="Garage Info"
        >
          <span className="material-symbols-outlined">verified_user</span>
          <span>{history.USERNAME} </span>
        </div>
      )}
      {history.USERNAME && (
        <div
          className="historyInfo"
          title="Garage Info"
        >
          <span className="material-symbols-outlined">alternate_email</span>
          <span>{history.EMAIL} </span>
        </div>
      )}
      {history.PARKNAME && (
        <div
          className="historyInfo"
          title="Garage Info"
        >
          <span className="material-symbols-outlined">local_parking</span>
          <span>
            {history.PARKNAME}, {history.AREA}, {history.CITY},{' '}
            {history.COUNTRY}
          </span>
        </div>
      )}
      <div
        className="historyInfo"
        title="Service Type"
      >
        <span className="material-symbols-outlined">settings</span>{' '}
        <span>{history.SERVICETYPE}</span>
      </div>
      <div
        className="historyInfo"
        title="Start Time"
      >
        <span className="material-symbols-outlined">hourglass_top</span>
        <span>{history.START_TIME}</span>
      </div>
      <div
        className="historyInfo"
        title="End Time"
      >
        <span className="material-symbols-outlined">hourglass_bottom</span>
        <span>{history.END_TIME}</span>
      </div>
      <div
        className="historyInfo"
        title="Total Amount"
      >
        <span className="material-symbols-outlined">attach_money</span>
        <span>{history.TOTAL_AMOUNT}</span>
      </div>
      <div
        className="historyInfo"
        title="Paid"
      >
        <span className="material-symbols-outlined">paid</span>
        <span>{history.PAID}</span>
      </div>
    </div>
  )
}
export default ShowUserParkHistory

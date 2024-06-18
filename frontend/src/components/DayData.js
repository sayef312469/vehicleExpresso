const DayData = ({ data }) => {
  return (
    <div className="showUserParkHistory">
      <div
        className="date_name"
        title="Service ID"
      >
        <h5>
          <span className="material-symbols-outlined">calendar_clock</span>
          {data.END_TIME}
        </h5>
      </div>
      <div
        className="historyInfo"
        title="Short Term Service"
      >
        <div className="key">
          <span className="material-symbols-outlined">local_taxi</span>
          Short Term Service
        </div>
        <div className="val">{data.SHORT_SERVICE}</div>
      </div>

      <div
        className="historyInfo"
        title="Long Term Service"
      >
        <div className="key">
          <span className="material-symbols-outlined">car_crash</span>
          Long Term Service
        </div>
        <div className="val">{data.LONG_SERVICE}</div>
      </div>

      <div
        className="historyInfo"
        title="Total Amount"
      >
        <div className="key">
          <span className="material-symbols-outlined">credit_card</span>
          Total Amount
        </div>
        <div className="val">{data.TOTAL_AMOUNT}</div>
      </div>

      <div
        className="historyInfo"
        title="Total Paid"
      >
        <div className="key">
          <span className="material-symbols-outlined">payments</span>
          Total Paid
        </div>
        <div className="val">{data.PAID}</div>
      </div>
    </div>
  )
}

export default DayData

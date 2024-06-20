

const Table = () => {
    return ( <table className='table'>
    <thead>
      <th>Owner Name</th>
      <th>Vehicle No</th>
      <th>Service ID</th>
      <th>Mechanic Name</th>
      <th>Repair</th>
      <th>Wash</th>
      <th>Service Date</th>
      <th>Status</th>
      <th>Total Cost</th>
      <th>Actions</th>
    </thead>
    <tbody>
        {!error && Array.isArray(rows) && rows.map((row, key) => {
          return <tr key={key} className='rows'>
            <td>{row.NAME}</td>
            <td>{row.VEHICLENO}</td>
            <td>{row.SERVICE_ID}</td>
            <td>{row.MECHANIC_NAME}</td>
            <td>type :{row.REPAIR.TYPE} cost: {row.REPAIR.COST}</td>
            <td>type :{row.WASH.TYPE} cost: {row.WASH.COST}</td>
            <td>{row.SERVICE_DATE?.slice(0,10)}</td>
            <td>{row.COMPLETED}</td>
            <td>{row.SERVICING_COST}</td>
        <td>
            <span>
            <BsFillTrashFill className='delete-btn' onClick={()=>HandleDeleteRow(key)}/>
            <BsFillPencilFill className='edit-btn' onClick={()=>HandleModalOpen(row)}/>
          </span>
        </td>
          </tr> 
        })}
    </tbody>
  </table> );
}
 
export default Table;
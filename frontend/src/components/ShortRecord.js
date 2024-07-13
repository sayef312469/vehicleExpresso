import { useState } from 'react';
import { useEffect } from 'react';
import useFetchTable from '../hooks/useFetchTable';
import {BsFillTrashFill,BsFillPencilFill,BsSearch} from 'react-icons/bs';
import '../styles/table.css';
import ShortModal from './ShortModal';

const ShortRecord = () => {

    const [modalOpen,setModalOpen]=useState(false);
    const [row,setRow]=useState([]);
    const [update,setUpdate]=useState(null);
    const HandleDeleteRow = (key)=>{
      setRows(rows.filter((_,keys) => keys !==key));
    }
    const HandleModalOpen = (row)=>{
      setModalOpen(!modalOpen);
      setRow(row);
    }
    const {data,error} = useFetchTable("shorttable",update);
    const [rows,setRows] = useState([]);

    useEffect(() => {
      setRows(data.table);
      console.log(data.table);
    }, [data]);

    return ( 
    <div className='shortrecord'>
      <h2>Shorterm Record </h2>
        <hr/>
        Search
        <BsSearch className='search-btn' onClick={()=>HandleDeleteRow()}/>
        {/* <input type='text'></input> */}
        <table className='table'>
                <thead>
                  <th>Service ID</th>
                  <th>Owner Name</th>
                  <th>Vehicle No</th>
                  <th>Mechanic Name</th>
                  <th>Repair-type,cost(tk))</th>
                  <th>Wash-type,cost(tk)</th>
                  <th>Service Date</th>
                  <th>Labor Hours</th>
                  <th>Status</th>
                  <th>TotalCost(Tk)</th>
                  <th>Actions</th>
                </thead>
                <tbody>
                    {!error && rows?.map((row, key) => {
                      return <tr key={key} className='rows'>
                        <td>{row.SERVICE_ID}</td>
                        <td>{row.NAME}</td>
                        <td>{row.VEHICLENO}</td>
                        <td>{row.MECHANIC_NAME}</td>
                        <td>{row.REPAIR.TYPE!=null?row.REPAIR.TYPE:'-'}, {row.REPAIR.COST}</td>
                        <td>{row.WASH.TYPE!=null?row.WASH.TYPE:'-'}, {row.WASH.COST}</td>
                        <td>{row.SERVICE_DATE}</td>
                        <td>{row.LABOR_HOURS}</td>
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
              </table>
              {modalOpen && <ShortModal row={row} Update={[update,setUpdate]} closeModal={()=>{
                  setModalOpen(false);}}/> }
            </div>
    );
}
 
export default ShortRecord;
import { useState } from 'react';
import { useEffect } from 'react';
import useFetchTable from '../hooks/useFetchTable';
import {BsFillTrashFill,BsFillPencilFill,BsTools} from 'react-icons/bs';
import '../styles/table.css';
import LongModal from './LongModal';
import MaintenanceInfo from './MaintenanceInfo';

const LongRecord = () => {
    const [modalOpen,setModalOpen]=useState(false);
    const [maintInfoOpen,setMaintInfoOpen]=useState(false);
    const [row,setRow]=useState([]);
    const [update,setUpdate]=useState(null);
    const HandleDeleteRow = (key)=>{
      setRows(rows.filter((_,keys) => keys !==key));
    }
    const HandleModalOpen = (row)=>{
      setModalOpen(!modalOpen);
      setRow(row);
    }

    const HandleMaintInfo = (row)=>{
        console.log('open');
        setMaintInfoOpen(!maintInfoOpen);
        setRow(row);
    }
    const {data,error} = useFetchTable("longtable",update);
    const [rows,setRows] = useState([]);

    useEffect(() => {
      setRows(data.table);
    }, [data]);

    return ( 
    <div className='longrecord'>
        <h2>Longterm Record (MAINTENANCE INFO)</h2>
        <hr/>
        <table className='table'>
                <thead>
                  <th>Service ID</th>
                  <th>Owner Name</th>
                  <th>Vehicle No</th>
                  <th>Start Date</th>
                  <th>Final Date</th>
                  <th>Mechanic Name</th>
                  <th>Odometer Read</th>
                  <th>Maint. Category</th>
                  <th>Ins. Provider</th>
                  <th>Ins. Exp Date</th>
                  <th>Total Cost(Tk)</th>
                  <th>Actions</th>
                </thead>
                <tbody>
                    {!error && rows?.map((row, key) => {
                      return <tr key={key} className='rows'>
                        <td>{row.SERVICE_ID}</td>
                        <td>{row.NAME}</td>
                        <td>{row.VEHICLENO}</td>
                        <td>{row.SERVICE_DATE}</td>
                        <td>{row.FINAL_DATE}</td>
                        <td>{row.MECHANIC_NAME}</td>
                        <td>{row.ODOMETER_READING}</td>
                        <td>{row.MAINTENANCE_CATEGORY}</td>
                        <td>{row.INSURANCE_PROVIDER}</td>
                        <td>{row.INSURANCE_EXP_DATE}</td>
                        <td>{row.SERVICING_COST}</td>
                    <td>
                        <span>
                        <BsFillTrashFill className='delete-btn' onClick={()=>HandleDeleteRow(key)}/>
                        <BsFillPencilFill className='edit-btn' onClick={()=>HandleModalOpen(row)}/>
                        <BsTools className='des-btn' onClick={()=>HandleMaintInfo(row)}/>
                      </span>
                    </td>
                      </tr> 
                    })}
                </tbody>
              </table>
              {modalOpen && 
              <LongModal row={row} 
                Update={[update,setUpdate]} 
                closeModal={()=>{setModalOpen(false);}}/>}
              {maintInfoOpen && 
              <MaintenanceInfo row={row}
                closeModal={()=>{setMaintInfoOpen(false);}}/>}
            </div>
    );
}
 
export default LongRecord;
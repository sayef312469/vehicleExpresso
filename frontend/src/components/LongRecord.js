import { useState } from 'react';
import { useEffect } from 'react';
import useFetchTable from '../hooks/useFetchTable';
import {BsFillTrashFill,BsFillPencilFill,BsTools,BsFillFilterSquareFill, BsArrowLeft, BsArrowRight} from 'react-icons/bs';
import '../styles/table.css';
import LongModal from './LongModal';
import MaintenanceInfo from './MaintenanceInfo';
import DelWrnModal from './DelWrnModal';
import { Toaster } from 'react-hot-toast';

const LongRecord = () => {
    const itemsperPage=15;
    const rowHead=['ServiceID','OwnerName','VehicleNo','StartDate','FinalDate','MechanicName','OdometerRead','MaintCategory','InsProvider','InsExpDate','TotalCost'];
    const [modalOpen,setModalOpen]=useState(false);
    const [maintInfoOpen,setMaintInfoOpen]=useState(false);
    const [row,setRow]=useState([]);
    const [update,setUpdate]=useState(null);
    const [lowindx,setLowindx] = useState(0);
    const [filterTerm,setFilterTerm] = useState('');
    const [filterBy,setFilterBy] = useState(rowHead[0]);
    const [highindx,setHighindx] = useState(itemsperPage);
    const {data,error} = useFetchTable("longtable",
    update,{
      lowindx: lowindx, 
      highindx: highindx,
      filterby: filterBy,
      filterterm: filterTerm
    });
    const [rows,setRows] = useState([]);
    const [delWrnOpen,setDelWrnOpen] = useState(false);
    const [currentRows,setCurrentRows] = useState([]);
    const [disnxt,setDisnxt]=useState(false);
    const [disprev,setDisprev]=useState(false);

    useEffect(()=>{
      setCurrentRows(data.table);
      setDisnxt(highindx>=data?.size?true:false);
      setDisprev(lowindx<=1?true:false);
      console.log(data);
    },[data])

    const HandleDeleteRow = (row)=>{
      setDelWrnOpen(!delWrnOpen);
      setRow(row);
    }
    const HandleModalOpen = (row)=>{
      setModalOpen(!modalOpen);
      setRow(row);
    }
    const HandleMaintInfo = (row)=>{
        setMaintInfoOpen(!maintInfoOpen);
        setRow(row);
    }
    const HandlePrevious=()=>{
      setHighindx(lowindx-1);
      setLowindx(Math.max((lowindx-itemsperPage),0));
    }
    const HandleNext=()=>{
      setLowindx(highindx+1);
      setHighindx(Math.min((highindx+itemsperPage),rows?.length));
    }

    return ( 
    <div className='longrecord'>
        <h3>Longterm Record (Maintenance Info)</h3>
        <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(to right, #000000, #1a1a1a, #333333, #4d4d4d, #666666, #4d4d4d, #333333, #1a1a1a, #000000)', width: '90%', margin: '20px ' }} />
        <div className='filter-bar'>
          <BsFillFilterSquareFill className='filter-btn'/>
          <select className='filter-option' value={filterBy} onChange={(e)=>
            { 
              setLowindx(0);
              setHighindx(itemsperPage);
              setFilterBy(e.target.value);
            }}>
            {rowHead.map((head,key)=>{return (<option key={key} value={head}>{head}</option>);})}
          </select>
          <input className='search-input' placeholder='Search'onChange={(e)=>
           {
            setLowindx(0);
            setHighindx(itemsperPage);
            setFilterTerm(e.target.value)
          }} />
        </div>
        <table className='table'>
                <thead>
                {rowHead.map((head,key)=>{
                    return (<th key={key}>{head}</th>);})}
                    <th>Action</th>
                </thead>
                <tbody>
                    {!error && currentRows?.map((row, key) => {
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
                        <BsFillTrashFill className='delete-btn' onClick={()=>HandleDeleteRow(row)}/>
                        <BsFillPencilFill className='edit-btn' onClick={()=>HandleModalOpen(row)}/>
                        <BsTools className='des-btn' onClick={()=>HandleMaintInfo(row)}/>
                      </span>
                    </td>
                      </tr> 
                    })}
                </tbody>
              </table>
              <div className='page-buttons'>
                <BsArrowLeft className={`arrow-button ${disprev?'disable':''}`} onClick={HandlePrevious}/>
                <BsArrowRight className={`arrow-button ${disnxt?'disable':''}`} onClick={HandleNext}/>
              </div>
              {modalOpen && 
              <LongModal row={row} 
                Update={[update,setUpdate]} 
                closeModal={()=>{setModalOpen(false);}}/>}
              {maintInfoOpen && 
              <MaintenanceInfo row={row}
                Update={[update,setUpdate]}
                closeModal={()=>{setMaintInfoOpen(false);}}/>}
              {delWrnOpen && 
              <DelWrnModal row={row} 
              Update={[update,setUpdate]} 
              Record='LongTerm'
              closeModal={()=>{setDelWrnOpen(false);}}/>}
              <Toaster
              position="top-center"
              reverseOrder={false}
              theme="light"
              toastOptions={{
                className: '',
                style: {
                  border: '1px solid #ccc',
                  padding: '16px',
                  color: 'crimson',
                },
              }}
              />
            </div>
    );
}
 
export default LongRecord;
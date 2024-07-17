import { useState } from 'react';
import { useEffect } from 'react';
import useFetchTable from '../hooks/useFetchTable';
import {BsFillTrashFill,BsFillPencilFill,BsTools,BsFillFilterSquareFill, BsArrowLeft, BsArrowRight} from 'react-icons/bs';
import '../styles/table.css';
import LongModal from './LongModal';
import MaintenanceInfo from './MaintenanceInfo';
import DelWrnModal from './DelWrnModal';
import toast, { Toaster } from 'react-hot-toast';

const LongRecord = () => {
  const rowHead=['ServiceID','OwnerName','VehicleNo','StartDate','FinalDate','MechanicName','OdometerRead','Maint.Category','Ins.Provider','Ins.ExpDate','TotalCost(Tk)'];
    const [modalOpen,setModalOpen]=useState(false);
    const [maintInfoOpen,setMaintInfoOpen]=useState(false);
    const [row,setRow]=useState([]);
    const [update,setUpdate]=useState(null);
    const {data,error} = useFetchTable("longtable",update);
    const [rows,setRows] = useState([]);
    const [cprows,setCprows] = useState([]);
    const [isFilterActive,setIsFilterActive] = useState(false);
    const [filterTerm,setFilterTerm] = useState('');
    const [filterby,setFilterby] = useState(rowHead[0]);
    const [delWrnOpen,setDelWrnOpen] = useState(false);
    const itemsperPage=5;
    const [lowindx,setLowindx] = useState(0);
    const [highindx,setHighindx] = useState(itemsperPage);
    const [currentRows,setCurrentRows] = useState([]);
    const [disnxt,setDisnxt]=useState(false);
    const [disprev,setDisprev]=useState(false);

    useEffect(() => {
      setRows(data.table);
      setCprows(data.table);
    }, [data]);

    useEffect(()=>{
      setLowindx(0);
      setHighindx(itemsperPage);
      if(filterTerm!==""){
        const filteredRows=rows?.filter((row) => {        
          switch(filterby){
            case rowHead[0]:
              return row.SERVICE_ID?.toString().toLowerCase().includes(filterTerm);
            case rowHead[1]:
              return row.NAME?.toLowerCase().includes(filterTerm);
            case rowHead[2]:
              return row.VEHICLENO?.toLowerCase().includes(filterTerm);
            case rowHead[3]:
              return row.SERVICE_DATE?.toLowerCase().includes(filterTerm);
            case rowHead[4]:
              return row.FINAL_DATE?.toLowerCase().includes(filterTerm);
            case rowHead[5]:
              return row.MECHANIC_NAME?.toLowerCase().includes(filterTerm);
            case rowHead[6]:
              return row.ODOMETER_READING?.toString().toLowerCase().includes(filterTerm);
            case rowHead[7]:
              return row.MAINTENANCE_CATEGORY?.toLowerCase().includes(filterTerm);
            case rowHead[8]:
              return row.INSURANCE_PROVIDER?.toLowerCase().includes(filterTerm);
            case rowHead[9]:
              return row.INSURANCE_EXP_DATE?.toLowerCase().includes(filterTerm);
            case rowHead[10]:
              return row.SERVICING_COST?.toString().includes(filterTerm);
          }
      });
      setRows(filteredRows)}}
    ,[filterTerm,filterby]);

    useEffect(()=>{
      setCurrentRows(rows?.slice(lowindx,highindx));
      setDisnxt(highindx>=rows?.length?true:false);
      setDisprev(lowindx<=0?true:false);
      console.log(rows);
    },[lowindx,highindx,rows])

    const HandleFilterActive = (e)=>{
      setRows(cprows);
      setFilterTerm(e.target.value.toLowerCase());
    }
    const HandleFilterBy = ()=>{
      setIsFilterActive(!isFilterActive);
    }
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
      setHighindx(lowindx);
      setLowindx(Math.max((lowindx-itemsperPage),0));
    }
    const HandleNext=()=>{
      setLowindx(highindx);
      setHighindx(Math.min((highindx+itemsperPage),rows?.length));
    }

    return ( 
    <div className='longrecord'>
        <h3>Longterm Record (Maintenance Info)</h3>
        <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(to right, #000000, #1a1a1a, #333333, #4d4d4d, #666666, #4d4d4d, #333333, #1a1a1a, #000000)', width: '90%', margin: '20px ' }} />
        <div className='filter-bar'>
          <BsFillFilterSquareFill className='filter-btn' onClick={()=>HandleFilterBy()}/>
          <select className={`filter-option ${isFilterActive?'active':''}`} value={filterby} onChange={(e)=>{ setFilterby(e.target.value);
                                                                                                              setRows(cprows);}}>
            {rowHead.map((head,key)=>{return (<option key={key} value={head}>{head}</option>);})}
          </select>
          <input className={`search-input ${isFilterActive?'active':''}`} placeholder='Search'onChange={(e)=>HandleFilterActive(e)} />
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
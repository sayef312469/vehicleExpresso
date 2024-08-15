import { useState } from 'react';
import { useEffect } from 'react';
import useFetchTable from '../hooks/useFetchTable';
import {BsFillTrashFill,BsFillPencilFill,BsFillFilterSquareFill, BsArrowLeft, BsArrowRight} from 'react-icons/bs';
import '../styles/table.css';
import ShortModal from './ShortModal';
import DelWrnModal from './DelWrnModal';
import toast, { Toaster } from 'react-hot-toast';

const ShortRecord = () => {
    const rowHead=['ServiceID','OwnerName','VehicleNo','MechanicName','RepairType,Cost(tk)','WashType,Cost(tk)','ServiceDate','LaborHours','Status','TotalCost'];
    const [modalOpen,setModalOpen]=useState(false);
    const [row,setRow]=useState([]);
    const [update,setUpdate]=useState(null);
    const {data,error} = useFetchTable("shorttable",update);
    const [rows,setRows] = useState([]);
    const [cprows,setCprows] = useState([]);
    const [isFilterActive,setIsFilterActive] = useState(false);
    const [filterTerm,setFilterTerm] = useState('');
    const [filterby,setFilterby] = useState(rowHead[0]);
    const [delWrnOpen,setDelWrnOpen] = useState(false);
    const itemsperPage=15;
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
              return row.MECHANIC_NAME?.toLowerCase().includes(filterTerm);
            case rowHead[4]:
              return (row.REPAIR.TYPE?.toLowerCase().includes(filterTerm) || row.REPAIR.COST?.toString().toLowerCase().includes(filterTerm));
            case rowHead[5]:
              return (row.WASH.TYPE?.toLowerCase().includes(filterTerm)|| row.WASH.COST?.toString().toLowerCase().includes(filterTerm));
            case rowHead[6]:
              return row.SERVICE_DATE?.toLowerCase().includes(filterTerm);
            case rowHead[7]:
              return row.LABOR_HOURS?.toString().toLowerCase().includes(filterTerm);
            case rowHead[8]:
              return row.COMPLETED.toLowerCase().includes(filterTerm);
            case rowHead[9]:
              return row.SERVICING_COST.toString().includes(filterTerm);
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
    const HandlePrevious=()=>{
      setHighindx(lowindx);
      setLowindx(Math.max((lowindx-itemsperPage),0));
    }
    const HandleNext=()=>{
      setLowindx(highindx);
      setHighindx(Math.min((highindx+itemsperPage),rows?.length));
    }
    
    return ( 
    <div className='shortrecord'>
      <h3>Shorterm Record </h3>
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
                        <td>{row.MECHANIC_NAME}</td>
                        <td>{row.REPAIR.TYPE!=null?row.REPAIR.TYPE:null}| {row.REPAIR.COST}</td>
                        <td>{row.WASH.TYPE!=null?row.WASH.TYPE:null}| {row.WASH.COST}</td>
                        <td>{row.SERVICE_DATE}</td>
                        <td>{row.LABOR_HOURS}</td>
                        <td>{row.COMPLETED}</td>
                        <td>{row.SERVICING_COST}</td>
                    <td>
                        <span>
                        <BsFillTrashFill className='delete-btn' onClick={()=>HandleDeleteRow(row)}/>
                        <BsFillPencilFill className='edit-btn' onClick={()=>HandleModalOpen(row)}/>
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
              <ShortModal row={row} 
              Update={[update,setUpdate]} 
              closeModal={()=>{setModalOpen(false);}}/>}
              {delWrnOpen && 
              <DelWrnModal row={row} 
              Update={[update,setUpdate]} 
              Record='ShortTerm' 
              closeModal={()=>{setDelWrnOpen(false);}}/>}
              <Toaster
              position="top-center"
              reverseOrder={false}
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
 
export default ShortRecord;
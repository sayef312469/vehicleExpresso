import { useState } from 'react';
import { useEffect } from 'react';
import useFetchTable from '../hooks/useFetchTable';
import {BsFillTrashFill,BsFillPencilFill,BsFillFilterSquareFill, BsArrowLeft, BsArrowRight} from 'react-icons/bs';
import '../styles/table.css';
import ShortModal from './ShortModal';
import DelWrnModal from './DelWrnModal';
import { Toaster } from 'react-hot-toast';

const ShortRecord = () => {
    const itemsperPage=15;
    const rowHead=['ServiceID','OwnerName','VehicleNo','MechanicName','RepairType','RepairCost','WashType','WashCost','ServiceDate','LaborHours','Status','TotalCost'];
    const [modalOpen,setModalOpen]=useState(false);
    const [row,setRow]=useState([]);
    const [update,setUpdate]=useState(null);
    const [lowindx,setLowindx] = useState(0);
    const [highindx,setHighindx] = useState(itemsperPage);
    const [filterBy,setFilterBy] = useState(rowHead[0]);
    const [filterTerm, setFilterTerm] = useState('');
    const {data,error} = useFetchTable("shorttable",
    update,
    {
      lowindx: lowindx, 
      highindx: highindx,
      filterby: filterBy,
      filterterm: filterTerm
    });
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
    const HandlePrevious=()=>{
      setHighindx(lowindx-1);
      setLowindx(Math.max((lowindx-itemsperPage),1));
    }
    const HandleNext=()=>{
      setLowindx(highindx+1);
      setHighindx(Math.min((highindx+itemsperPage),data?.size));
    }
    
    return ( 
    <div className='shortrecord'>
      <h3>Shorterm Record </h3>
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
          <input className='search-input' placeholder='Search' onChange={(e)=>
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
                        <td>{row.MECHANIC_NAME}</td>
                        <td>{row.REPAIRTYPE}</td>
                        <td>{row.REPAIRCOST}</td>
                        <td>{row.WASHTYPE}</td>
                        <td>{row.WASHCOST}</td>
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
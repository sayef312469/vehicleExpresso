import { useEffect, useState } from 'react'
import '../styles/modal.css'

const Maintenance_info = ({row,Update,closeModal}) => {
    const prem_serv=['Fluid check','Battery maintenance','Break inspection','Tire change','Air-filter replace','Spark-plug replace','Suspension-steering','Fuel-system clean','Timing-belt replace','Transmission replace'];
    const bas_serv=['Fluid check','Battery maintenance','Break inspection','Tire change','Air-filter replace'];
    const [update,setUpdate]=Update;
    const [err,setErr] = useState(null);
    const [data,setData] = useState('');
    const [maintype,setMaintype] = useState('Basic');
    const [nxtServDate,setNxtServDate] = useState('');
    const [nxtMainType,setNxtMainType] = useState('Basic');
    //basic
    const [state,setState] = useState({
       'Fluid check' :false,
       'Battery maintenance': false,
       'Break inspection': false,
       'Tire change': false,
       'Air-filter replace': false,
       'Spark-plug replace': false,
       'Suspension-steering': false,
       'Fuel-system clean': false,
       'Timing-belt replace': false,
       'Transmission replace': false
    });

    const updateState =(key, value)=>{
        console.log(key,value)
        setState(prev_state=>({
            ...prev_state,
            [key]: value
        }))
    }
    const [costs,setCosts] = useState([0,0,0,0,0,0,0,0,0,0]);
    const [totalcost,setTotalcost]=useState(0);

    useEffect(() => {
        let sum=0;
        for(let i=0;i<costs.length;++i){
            if(!isNaN(costs[i]) && costs[i]!=="")sum+=parseFloat(costs[i]);
        }
        setTotalcost(parseFloat(sum.toFixed(3)));
    }, [costs]);

    const generatePremiumDesp=()=>{
        let desp=[];
        for(let i=0;i<costs.length;++i){
            if(costs[i]>0)desp.push(`${prem_serv[i]}=${costs[i]}`);
        }
        return desp.join(',');
    }
    
    const generateBasicDesp=()=>{
        let desp=[];
        for(let i=0;i<costs.length;++i){
            if(costs[i]>0)desp.push(`${bas_serv[i]}=${costs[i]}`);
        }
        return desp.join(',');
    }

    const UpdateMaintInfo =async()=>{
        try{
            let description="";
            if(maintype==='Basic'){
                let selected = false;
                for(let i=0;i<bas_serv.length;++i){
                    console.log(bas_serv[i],state[bas_serv[i]]);
                    if(state[bas_serv[i]]){
                        selected= true;
                        break;
                    }
                }
                if(!selected){
                    console.log('Select Atleast one service!!');
                    return;
                }
                description=generateBasicDesp();
            }
            else{
                let selected = false;
                for(let i=0;i<prem_serv.length;++i){
                    console.log(prem_serv[i],state[prem_serv[i]]);
                    if(state[prem_serv[i]]){
                        selected= true;
                        break;
                    }
                }
                if(!selected){
                    console.log('Select Atleast one service!!');
                    return;
                }
                description=generatePremiumDesp();
            }
                const response = await fetch(`http://localhost:4000/api/care/maintenanceinfo-update`,{
                    method: 'POST',
                    headers:{
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        service_id: row.SERVICE_ID,
                        description: description,
                        next_maintenance_date: nxtServDate,
                        totalcost: totalcost
                    })
                })
                const jsonData = await response.json()
                console.log(jsonData);
                setUpdate(jsonData);
        }catch(err){
            console.error(err);
            setErr(err.message)
        }
    }

    const HandleMaintInfo =(e)=>{
        e.preventDefault();
        UpdateMaintInfo();
        closeModal();
    }


    useEffect(()=>{
        const updateData = async () => {
            try {
              const response = await fetch(`http://localhost:4000/api/care/maintenance-info`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  service_id: row.SERVICE_ID,
                }),
              })
              if (!response.ok) throw new Error('Error to update short-table')
              const jsonData = await response.json()
              setData(jsonData.data);
              console.log(jsonData);
            //   setUpdate(jsonData)
            } catch (err) {
              console.error(err)
              setErr(err.message)
            }
          };
          updateData();
    },[])

    return ( 
    <div className="modal-container" onClick={(e)=>{
        if(e.target.className==='modal-container')closeModal();}}>
        <div className='maintenanceinfo-modal'>
            <hr/>
            <form className="maintform-group">
                <fieldset>
            <div className='final'>
                        <div className='info'>
                            <div className='Title'>
                                <h3>History</h3>
                            </div>
                                    {!err && Array.isArray(data) && data.map((val,key)=>{
                                        return <div className='history' key={key}>
                                            <ul>
                                                <li>Last service Date: {val.LAST_SERVICE_DATE}</li>
                                                <li>Maintenance info:<br/>{val.DESCRIPTION}</li>
                                                <li>Next service Date: {val.NEXT_SERVICE_DATE}</li>
                                            </ul>
                                        </div>
                                    })}
                        </div>
                        <div className='info'>
                            <div className='Title'>
                                <h3>Maintenance Update</h3>
                            </div>
                        <div className='add'>
                            <form>
                                <fieldset>
                                <div className='block'>
                                    <label htmlFor="maintenance-type">Maintenance ID: {row.SERVICE_ID}</label>
                                </div>
                                <div className='block'>
                                    <label htmlFor="maintenance-type">Service Type:</label>
                                    <select
                                        name="maintenance-type"
                                        value={maintype}
                                        onChange={(e) => {
                                        setMaintype(e.target.value)}}
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </div>
                                {maintype==='Basic' && <div className='check'>
                                   
                                    {bas_serv.map((val,key)=>{
                                        console.log(state[val]);
                                        return(
                                            
                                            <div className="check-block">
                                                <div className='block1'>
                                                    <input className='tic' 
                                                        type="checkbox" 
                                                        id={val} 
                                                        name={val} 
                                                        onChange={(e)=>{updateState(val,e.target.checked)}} 
                                                        checked={state[val]}/>
                                                    <label htmlFor={val}>{val}</label>
                                                </div>
                                                <div className='block2'>
                                                    <label htmlFor={`costs${key}`}>Cost(tk) </label>
                                                    <input className='cost' name={`costs${key}`}
                                                    value={costs[key]}
                                                    onChange={(e)=>{
                                                        const newCosts=[...costs];
                                                        newCosts[key]=e.target.value;
                                                        setCosts(newCosts)}}/>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>}
                                {maintype==='Premium' && <div className='check'>
                                {prem_serv.map((val,key)=>{
                                        console.log(state[val]);
                                        return(
                                            <div className="check-block">
                                                <div className='block1'>
                                                    <input className='tic' 
                                                        type="checkbox" 
                                                        id={val} 
                                                        name={val} 
                                                        onChange={(e)=>{updateState(val,e.target.checked)}} 
                                                        checked={state[val]}/>
                                                    <label htmlFor={val}>{val}</label>
                                                </div>
                                                <div className='block2'>
                                                    <label htmlFor={`costs${key}`}>Cost(tk) </label>
                                                    <input className='cost' name={`costs${key}`}
                                                    value={costs[key]}
                                                    onChange={(e)=>{
                                                        const newCosts=[...costs];
                                                        newCosts[key]=e.target.value;
                                                        setCosts(newCosts)}}/>
                                                </div>
                                            </div>
                                        );
                                    })}
                               </div>}
                                <div className='block'>
                                    <label htmlFor="total-cost">Total Cost: </label>
                                    <input type="text"
                                    name="total-cost"
                                    value={totalcost}/>
                                </div>
                                <div className='block'>
                                    <label htmlFor="nxt-maintenance-type">Next Service Type:</label>
                                    <select
                                        name="nxt-maintenance-type"
                                        value={nxtMainType}
                                        onChange={(e) => {
                                        setNxtMainType(e.target.value)}}>
                                        <option value="Basic">Basic</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </div>
                                <div className='block'>
                                    <label htmlFor="nxt-service-date">Next Service date: </label>
                                    <input type="date"
                                    name="nxt-service-date"
                                    value={nxtServDate}
                                    onChange={(e)=>{setNxtServDate(e.target.value)}}/>
                                </div>
                                <div style={{width: '100%',
                                display: 'flex',
                                justifyItems: 'flex-end'
                                }}>
                                    <button onClick={HandleMaintInfo}>Submit</button>
                                </div>
                             </fieldset>
                            </form>
                        </div>
                        </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div> 
    );
}
 
export default Maintenance_info;
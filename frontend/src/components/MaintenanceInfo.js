import { useEffect, useState } from 'react'
import '../styles/modal.css'

const Maintenance_info = ({row,Update,closeModal}) => {
    const [update,setUpdate]=Update;
    const [err,setErr] = useState(null);
    const [data,setData] = useState('');
    const [maintype,setMaintype] = useState('Basic');
    const [nxtServDate,setNxtServDate] = useState('');
    const [nxtMainType,setNxtMainType] = useState('Basic');
    //basic
    const [fluidcheck,setFluidcheck] = useState(false);
    const [batmaint,setBatmaint]=useState(false);
    const [breakinsp,setBreakinsp]=useState(false);
    const [tirecng,setTirecng]=useState(false);
    const [airfilrep,setAirfilrep]=useState(false);
    //premium
    const [sparkplugrep,setSparkplugrep] = useState(false);
    const [supsteer,setSupsteer]=useState(false);
    const [fuelsyscln,setFuelsyscln]=useState(false);
    const [timbelrep,setTimbelrep]=useState(false);
    const [transm,setTransm]=useState(false);
    //cost
    const [cost1,setCost1] = useState(0);
    const [cost2,setCost2] = useState(0);
    const [cost3,setCost3] = useState(0);
    const [cost4,setCost4] = useState(0);
    const [cost5,setCost5] = useState(0);
    const [totalcost,setTotalcost]=useState(0);

    useEffect(() => {
        const sum = parseFloat(cost1) + parseFloat(cost2) + parseFloat(cost3) + parseFloat(cost4) + parseFloat(cost5);
        setTotalcost(parseFloat(sum.toFixed(3)));
    }, [cost1, cost2, cost3, cost4, cost5]);

    const generatePremiumDesp=()=>{
        let desp=[];
        if(cost1>0){
            desp.push(`Spark-plug replace=${cost1}`);
        }
        if(cost2>0){
            desp.push(`Suspension-steering=${cost2}`);
        }
        if(cost3>0){
            desp.push(`Fuel-system clean=${cost3}`);
        }
        if(cost4>0){
            desp.push(`Timing-belt replce=${cost4}`);
        }
        if(cost5>0){
            desp.push(`Transmission replace=${cost5}`);
        }
        return desp.join(',');
    }
    const generateBasicDesp=()=>{
        let desp=[];
        if(cost1>0){
            desp.push(`Fluid check=${cost1}`);
        }
        if(cost2>0){
            desp.push(`Battery maintenance=${cost2}`);
        }
        if(cost3>0){
            desp.push(`Break inspection=${cost3}`);
        }
        if(cost4>0){
            desp.push(`Tire change=${cost4}`);
        }
        if(cost5>0){
            desp.push(`Air-filter replace=${cost5}`);
        }
        return desp.join(',');
    }

    const UpdateMaintInfo =async()=>{
        try{
            let description="";
            if(maintype==='Basic'){
                if(!fluidcheck && !batmaint && !breakinsp && !tirecng && !airfilrep){
                    console.log('Select Atleast one service!!');
                    return;
                }
                description=generateBasicDesp();
            }
            else{
                if(!sparkplugrep && !supsteer && !fuelsyscln && !timbelrep && !transm){
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
                        maintenance_type: maintype,
                        description: description,
                        next_maintenance_date: nxtServDate,
                        next_maintenance_type: nxtMainType,
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
            <div className='Title'>
                <h3>History</h3>
                <h3>Maintenance Update</h3>
            </div>
            <hr/>
            <form className="maintform-group">
                <fieldset>
                    <div className='final'>
                        <div className='info'>
                                    {!err && Array.isArray(data) && data.map((val,key)=>{
                                        return <div className='history' key={key}>
                                            Last service Date: {val.LAST_SERVICE_DATE} {val.FLAG && val.FLAG[0]==='B'?'(BASIC)':'(PREMIUM)'}<br/><br/>
                                            Basic Maintenance info:<br/>
                                            {val.BASIC_DESC}<br/><br/>
                                            Premium Maintenance info:<br/>
                                            {val.PREMIUM_DATE}<br/><br/>
                                            Next service Date: {val.NEXT_SERVICE_DATE} {val.FLAG && val.FLAG[1]==='B'?'(BASIC)':'(PREMIUM)'}<br/><br/>
                                        </div>
                                    })}
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
                                {maintype=='Basic' && <div className='check'>
                                <div className="check-block">
                                    <div className='block1'>
                                        <input className='tic' type="checkbox" id="fluid-check" name="fluid-check" onChange={(e)=>{setFluidcheck(e.target.checked)}} checked={fluidcheck}></input>
                                        <label htmlFor="fluid-check">Fluid checks</label>
                                    </div>
                                    <div className='block2'>
                                        <label htmlFor="cost1">Cost(tk) </label>
                                        <input className="cost" name="cost1"
                                            value={cost1}
                                            onChange={(e)=>{setCost1(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                <div className='block1'>
                                        <input className='tic' type="checkbox" id="battery-maint" name="battery-maint" onChange={(e)=>{setBatmaint(e.target.checked)}} checked={batmaint}></input>
                                        <label htmlFor="battery-maint">Battery maintenance</label>
                                    </div>
                                    <div className='block2'>
                                    <label htmlFor="cost2">Cost(tk) </label>
                                        <input className="cost" name="cost1"
                                            value={cost2}
                                            onChange={(e)=>{setCost2(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                    <div className='block1'>
                                        <input className='tic' type="checkbox" id="break-insp" name="break-insp" onChange={(e)=>{setBreakinsp(e.target.checked)}} checked={breakinsp}></input>
                                        <label htmlFor="break-insp">Break inspection</label>
                                    </div>
                                    <div className='block2'>
                                    <label htmlFor="cost3">Cost(tk) </label>
                                        <input className="cost" name="cost3"
                                            value={cost3}
                                            onChange={(e)=>{setCost3(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                <div className='block1'>
                                        <input className='tic' type="checkbox" id="tire-cng" name="tire-cng" onChange={(e)=>{setTirecng(e.target.checked)}} checked={tirecng}></input>
                                        <label htmlFor="tire-cng">Tire change</label>
                                    </div>
                                    <div className='block2'>
                                    <label htmlFor="cost4">Cost(tk) </label>
                                        <input className="cost" name="cost4"
                                            value={cost4}
                                            onChange={(e)=>{setCost4(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                <div className='block1'>
                                        <input className='tic' type="checkbox" id="air-filter-rep" name="air-filter-rep" onChange={(e)=>{setAirfilrep(e.target.checked)}} checked={airfilrep}></input>
                                        <label htmlFor="air-filter-rep">Air-filter replace</label>
                                    </div>
                                    <div className='block2'>
                                        <label htmlFor="cost5">Cost(tk) </label>
                                        <input className="cost" name="cost5"
                                            value={cost5}
                                            onChange={(e)=>{setCost5(e.target.value)}}/>
                                    </div>
                                </div>
                                </div>}
                                {maintype=='Premium' && <div className='check'>
                                <div className="check-block">
                                    <div className='block1'>
                                        <input className='tic' type="checkbox" id="sparkplug-replace" name="sparkplug-replace" onChange={(e)=>{setSparkplugrep(e.target.checked)}} checked={sparkplugrep}></input>
                                        <label htmlFor="sparkplug-replace">Spark-plug replace</label>
                                    </div>
                                    <div className='block2'>
                                        <label htmlFor="cost1">Cost(tk) </label>
                                        <input className="cost" name="cost1"
                                            value={cost1}
                                            onChange={(e)=>{setCost1(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                <div className='block1'>
                                        <input className='tic' type="checkbox" id="suspension-steering" name="suspension-steering" onChange={(e)=>{setSupsteer(e.target.checked)}} checked={supsteer}></input>
                                        <label htmlFor="suspension-steering">Suspension & steering</label>
                                    </div>
                                    <div className='block2'>
                                        <label htmlFor="cost2">Cost(tk) </label>
                                        <input className="cost" name="cost2"
                                            value={cost2}
                                            onChange={(e)=>{setCost2(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                    <div className='block1'>
                                        <input className='tic' type="checkbox" id="fuel-sys-clean" name="fuel-sys-clean" onChange={(e)=>{setFuelsyscln(e.target.checked)}} checked={fuelsyscln}></input>
                                        <label htmlFor="fuel-sys-clean">Fuel-system clean</label>
                                    </div>
                                    <div className='block2'>
                                        <label htmlFor="cost3">Cost(tk) </label>
                                        <input className="cost" name="cost3"
                                            value={cost3}
                                            onChange={(e)=>{setCost3(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                <div className='block1'>
                                        <input className='tic' type="checkbox" id="timing-belt-rep" name="timing-belt-rep" onChange={(e)=>{setTimbelrep(e.target.checked)}} checked={timbelrep}></input>
                                        <label htmlFor="timing-belt-rep">Timing-belt replace</label>
                                    </div>
                                    <div className='block2'>
                                        <label htmlFor="cost4">Cost(tk) </label>
                                        <input className="cost" name="cost4"
                                            value={cost4}
                                            onChange={(e)=>{setCost4(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="check-block">
                                <div className='block1'>
                                        <input className='tic' type="checkbox" id="transmission-serv" name="transmission-serv" onChange={(e)=>{setTransm(e.target.checked)}} checked={transm}></input>
                                        <label htmlFor="transmission-serv">Transmission Service</label>
                                    </div>
                                    <div className='block2'>
                                    <label htmlFor="cost5">Cost(tk) </label>
                                            <input className="cost" name="cost5"
                                            value={cost5}
                                            onChange={(e)=>{setCost5(e.target.value)}}/>
                                    </div>
                                </div>
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
                                <button className='click' onClick={HandleMaintInfo}>Submit</button>
                             </fieldset>
                            </form>
                        </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div> 
    );
}
 
export default Maintenance_info;
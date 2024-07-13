import { useState } from "react";

const LongModal = ({row,Update,closeModal}) => {

    const [update,setUpdate]=Update;
    const [mechanic,setMechanic]=useState(row.MECHANIC_NAME);
    const [insExpdate,setInsExpdate]=useState(row.INSURANCE_EXP_DATE);
    const [totalCost,setTotalCost]=useState(row.SERVICING_COST);
    const [odometerRead,setOdometerRead]=useState(row.ODOMETER_READING);
    const [err,setErr]=useState(null);

    const updateRow =async()=>{
        try{
            const response = await fetch(`http://localhost:4000/api/care/update-long`,{
                method : 'POST',
                headers : {
                    'Content-type':'application/json'
                },
                body: JSON.stringify({
                    service_id: row.SERVICE_ID,
                    mechanic: mechanic,
                    totalCost: Number(totalCost),
                    insExpdate: insExpdate,
                    odometerRead: odometerRead
                })
            })
            if(!response.ok) throw new Error('Error to update long-table');
            const jsonData = await response.json();
            setUpdate(jsonData);
            console.log(jsonData);
        }catch(err){
            console.log(err);
            setErr(err.message);
        }
    }

    const HandleSubmit = (e)=>{
        e.preventDefault();
        updateRow();
        closeModal();
    }
    return ( <div className="modal-container"
    onClick={(e)=>{if(e.target.className==='modal-container')closeModal();}}>
        <div className="modal">
            <h3>Edit Record</h3>
            <hr/>
            <form className="form-group">
                <fieldset>
                    <div>
                        <label htmlFor="mechanic">Mechanic </label>
                        <input name="mechanic"
                        value={mechanic}
                        onChange={(e)=>{setMechanic(e.target.value)}}/>
                    </div>
                    <div>
                        <label htmlFor="ins-expdate">InsExpDate </label>
                        <input type="date"
                        name="ins-expdate"
                        value={insExpdate}
                        onChange={(e)=>{setInsExpdate(e.target.value)}}/>
                    </div>
                    <div>
                        <label htmlFor="total-cost">Total Cost</label>
                        <input name="total-cost"
                        value={totalCost}
                        onChange={(e)=>{setTotalCost(e.target.value)}}/>
                    </div>
                    <div>
                        <label htmlFor="odometer">Odometer Read</label>
                        <input name="odometer"
                        value={odometerRead}
                        onChange={(e)=>{setOdometerRead(e.target.value)}}/>
                    </div>
                    <div>
                        <button onClick={HandleSubmit}>Generate</button>
                        <button onClick={HandleSubmit}>Submit</button>
                    </div>
                </fieldset>
            </form> 
        </div>
    </div> 
);}
 
export default LongModal;
import { useEffect, useState } from 'react'
import '../styles/modal.css'

const Maintenance_info = ({row,closeModal}) => {
    const [err,setErr] = useState(null);
    const [data,setData] = useState('');

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
                                            Basic Maintenance info:<br/>
                                            {val.BASIC_DESC}<br/><br/>
                                            Premium Maintenance info:<br/>
                                            {val.PREMIUM_DATE}<br/><br/>
                                            Last service Date: {val.LAST_SERVICE_DATE} {val.FLAG && val.FLAG[0]==='B'?'(BASIC)':'(PREMIUM)'}<br/><br/>
                                            Next service Date: {val.NEXT_SERVICE_DATE} {val.FLAG && val.FLAG[1]==='B'?'(BASIC)':'(PREMIUM)'}<br/><br/>
                                        </div>
                                    })}
                        </div>
                        <div className='add'>
                        </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div> 
    );
}
 
export default Maintenance_info;
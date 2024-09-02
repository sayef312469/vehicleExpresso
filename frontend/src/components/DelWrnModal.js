import { useState } from "react";
import toast from 'react-hot-toast';

const DelWrnModal = ({row,Update,Record,closeModal}) => {
      const [update,setUpdate] = Update;
      const [err,setErr] = useState(null);
      console.log(row.SERVICE_ID);

      const onConfirm = async()=>{
        try{
            const response = await fetch(`http://localhost:4000/api/care/maintenanceinfo-deletion`,{
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                },
                body: JSON.stringify({
                    service_id: row.SERVICE_ID,
                    record: Record
                })
            })
            if(!response.ok) throw new Error('Error to delete maintenance-info');
            const jsonData = await response.json();
            setUpdate(jsonData);
            console.log(jsonData);
            toast.success(`Service ID: ${row.SERVICE_ID} deleted sucessfully`);
        }catch(err){
            console.error(err);
            setErr(err.message);
            toast.error(`Network Error!`);
        }
        closeModal();
      }
    return ( 
    <div className="modal-container" onClick={(e)=>{if(e.target.className==='modal-container')closeModal();}}>
        <div className='delwrn-modal'>
            <h3>Confirm Deletion</h3>
            <p>Do you want to delete this row permanently?</p>
            <div className='buttons'>
                <button className='del' onClick={onConfirm}>Yes</button>
                <button className='cncl' onClick={closeModal}>No</button>
            </div>
        </div>
    </div> );
}
 
export default DelWrnModal;
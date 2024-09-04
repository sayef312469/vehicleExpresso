import { useState } from "react"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useAuthContext } from '../hooks/useAuthContext'

const LongModal = ({row,Update,closeModal}) => {
    const { user } = useAuthContext();
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
    const HandleGenerateBill = (e) => {
        e.preventDefault()
        const doc = new jsPDF()
        const columns = ['Maintenance Type', 'Start Date', 'Final date']
        const rows = [
          [`${row.MAINTENANCE_CATEGORY}`, `${row.SERVICE_DATE}`, `${row.FINAL_DATE}`],
        ]
    
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text(`LONGTERM CARE BILL`, 75, 20)
        doc.text(`Owner Name:${user.name.toUpperCase()}`, 20, 30)
        doc.text(`E-mail: ${user.email}`, 20, 40)
        doc.text(`Vehicle no: ${row.VEHICLENO}`, 20, 50)
    
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.autoTable({
          startY: 70,
          head: [columns],
          body: rows,
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          bodyStyles: { textColor: 50 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          columnStyles: { 2: { halign: 'right' } },
          theme: 'grid',
        })
        doc.text(`Your Total Cost: ${row.SERVICING_COST} Tk`, 14, 130)
        doc.save(`${row.VEHICLENO}.pdf`)
      }

    const HandleSubmit = (e)=>{
        e.preventDefault();
        updateRow();
        closeModal();
    }
    return ( 
    <div className="modal-container1" onClick={(e)=>{if(e.target.className==='modal-container1')closeModal();}}>
        <div className="modal1">
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
                        <button onClick={HandleGenerateBill}>Generate</button>
                        <button onClick={HandleSubmit}>Submit</button>
                    </div>
                </fieldset>
            </form> 
        </div>
    </div> 
);}
 
export default LongModal;
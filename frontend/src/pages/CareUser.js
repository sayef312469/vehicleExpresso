import { useState ,useRef, useEffect} from "react";
import '../styles/user.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../hooks/useAuthContext';


const CareUser = () => {
    const { user } = useAuthContext();
    const [data,setData]=useState('');
    const [error,setError] = useState(null);
    const longtermRef = useRef(null);
    const shorttermRef = useRef(null);
    const [visible1,setVisible1]=useState(false);
    const [visible2,setVisible2]=useState(false);
    const [exit1,setExit1]=useState(true);
    const [exit2,setExit2]=useState(true);
    const shorturl=`http://localhost:4000/api/care/shortuser`;
    const longurl=`http://localhost:4000/api/care/longuser`;
    const vehicleurl=`http://localhost:4000/api/care/vehicleno`;
    const [no,setNo]=useState('');
    const [date,setDate]=useState('');
    const [repairtype,setRepairtype]=useState('');
    const [washtype,setWashtype]=useState('');
    const [repair,setRepair]=useState(false);
    const [wash,setWash]=useState(false);
    const [basic,setBasic]=useState(false);
    const [premium,setPremium]=useState(false);
    const [finaldate,setFinaldate]=useState('');
    const [insProv,setInsProv]=useState('');
    const [insExp,setInsExp]=useState('');
    const [odometer,setOdometer]=useState('');
    const [shortBill,setShortBill]=useState([{}]);
    const [longBill,setLongBill]=useState([{}]);

    useEffect(()=>{
      const getVehicleno = async()=>{
        try{
          const response = await fetch(vehicleurl,{
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json' 
            },
            body: JSON.stringify({
              vehicleOwner: user.id
            })
          })
          if(!response.ok) throw new Error('Error occured')
          const jsonData= await response.json();
          setData(jsonData.data);
          setShortBill(jsonData.shortBill);
          setLongBill(jsonData.longBill);
          setNo(jsonData.data[0].VEHICLENO);
          console.log(jsonData);
        }catch(err){
          console.error(err);
          setError(err.message);
        }
      }
      getVehicleno();
    },[])

    const clear = ()=>{
      setNo(data[0].VEHICLENO);
      setDate("");
      setRepair(false);
      setRepairtype("");
      setWash(false);
      setWashtype("");
      setBasic(false);
      setPremium(false);
      setFinaldate("");
      setInsExp("");
      setInsProv("");
      setOdometer("");
    }

    const promise =(id)=>{
      const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));
      toast.promise(
        resolveAfter3Sec,
        {
          pending: 'Your service token is generating...',
          success: `Mr. ${user.name}, plz collect your Service token : ${id}`,
          error: 'Failure! Try again!'
        }
    )
    }
    const warning =(notif)=>toast.error(notif);
  

    const HandleLongTerm = ()=>{
      setVisible1(!visible1);
      setExit1(!exit1);
      if(visible2)HandleShortExit();
    }
    const HandleShortTerm = ()=>{
      setVisible2(!visible2);
      setExit2(!exit2);
      if(visible1)HandleLongTerm();
    }

    const HandleLongExit = ()=>{
      setVisible1(!visible1);
      setExit1(!exit1);
    }
    const HandleShortExit = ()=>{
      setVisible2(!visible2);
      setExit2(!exit2);
    }


      const insertLongData = async () =>{
        try {
          const response = await fetch(longurl,
              {
                  method: 'POST',
                  headers: {
                      'Content-Type':'application/json',
                  },
                  body: JSON.stringify({
                    vehicleno: no,
                    vehicleowner: user.id,
                    date: date,
                    main_category:basic?"Basic":"Premium",
                    finaldate:finaldate,
                    ins_prov:insProv,
                    ins_expdate:insExp,
                    odometer:odometer
                  })
              }
          );
          if (!response.ok) throw new Error('Failed to fetch data');
          const jsonData = await response.json();
          console.log(jsonData);
          promise(jsonData.service_id);
          clear();
        }catch(err){
          console.error('Error fetching data : ',err);
          warning(`Failure! Try again!`);
        }
      }
      const insertShortData = async () => {
        try {
          const response = await fetch(shorturl,
              {
                  method: 'POST',
                  headers: {
                      'Content-Type':'application/json',
                  },
                  body: JSON.stringify({
                    vehicleno: no,
                    vehicleowner: user.id,
                    date: date,
                    repairtype: repairtype,
                    washtype: washtype
                  })
              }
          );
          if (!response.ok) throw new Error('Failed to fetch data');
          const jsonData = await response.json();
          promise(jsonData.service_id);
          clear();
        }catch(err){
          console.error('Error fetching data : ',err);
          warning(`Failure! Try again!`);
        }
      };


      const HandleLongSubmit = (e)=>{
        e.preventDefault();
        if(!premium && !basic){
          console.log('Select a category!');
        }
        else if(!date){
          console.log('Select the start date!');
        }
        else if(!odometer){
          console.log('Odometer read is missing!');
        }
        else if(!finaldate){
          console.log('Select the final date!');
        }
        else{
          insertLongData();
          HandleLongExit();
        }
      } 

      const HandleShortSubmit = (e)=>{
        e.preventDefault();
        if(!date){
          console.log('Select a date!');
        }
        else if(!repair && !wash){
          console.log('Choose At least one service!');
        }
        else if(repair && !repairtype){
          console.log('Describe the repair type!');
        }
        else if(wash && !washtype){
          console.log('Describe the wash type!');
        }
        else{
          HandleShortExit();
          insertShortData();
        }
      }




    return (
      <div className="user" onClick={(e)=>{
        if(e.target.className ==="user"){
          if(visible1)HandleLongExit();
          else if(visible2)HandleShortExit();
          console.log('clicked outside');
        }
      }}>
        <h3>Book for your desired service now!</h3>
        <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(to right, #000000, #1a1a1a, #333333, #4d4d4d, #666666, #4d4d4d, #333333, #1a1a1a, #000000)', width: '90%', margin: '20px ' }} />
        <div className="buttons">
            <button onClick={HandleLongTerm}>Longterm Vehicle care</button>
            <button onClick={HandleShortTerm}>Shorterm Vehicle care</button>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {visible1 && !exit1 && (
          <form ref={longtermRef} className="popup">
            <button className="exit" onClick={HandleLongExit}>X</button>
            <fieldset>
            <h5>LONGTERM CARE</h5>
            <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(to right, #000000, #1a1a1a, #333333, #4d4d4d, #666666, #4d4d4d, #333333, #1a1a1a, #000000)', width: '90%', margin: '20px ' }} />
              <legend>ENTER VEHICLE NO:</legend>
              <div className="block">
                <label htmlFor="vehicleno">Vehicle No:</label>
                <select name="vehicleno" value={no} onChange={(e)=>{setNo(e.target.value)}}>
                  {!error && Array.isArray(data) && data.map((vehicle,key)=>{ return <option key={key} value={vehicle.VEHICLENO}>{vehicle.VEHICLENO}</option>})}
                </select>
              </div>
              <legend>MAINTENANCE INFO:</legend>
              <div className="block">
                <label >Category:</label>
                <div className="check-block">
                  <input type="checkbox" id="basic" name="basic" 
                  onChange={(e)=>{
                    const isChecked=e.target.checked;
                    setBasic(isChecked);
                    if(isChecked)setPremium(false)
                  }} checked={basic}/>
                  <label htmlFor="basic">Basic</label>
                </div>
                <div className="check-block">
                  <input type="checkbox" id="premium" name="premium" 
                  onChange={(e)=>{
                    const isChecked=e.target.checked;
                    setPremium(isChecked);
                    if(isChecked)setBasic(false);
                  }} checked={premium}/> 
                    <label htmlFor="premium">Premium</label>
                </div>
              </div>
              <div className="block">
                <label htmlFor="ins-provider">Insurance Provider:</label>
                <input type="text" id="ins-provider" name="ins-provider" onChange={(e)=>{setInsProv(e.target.value)}} value={insProv}/>
              </div>
              <div className="block">
                <label htmlFor="ins-expdate">Insurance Exp date:</label>
                <input type="date" id="ins-expdate" name="ins-expdate" onChange={(e)=>{setInsExp(e.target.value)}} value={insExp}/>
              </div>
              <div className="block">
                <label htmlFor="odometer">Odometer Read:</label>
                <input type="text" id="odometer" name="odometer" onChange={(e)=>{setOdometer(e.target.value)}} value={odometer}/>
              </div>
              <div className="block">
                <label htmlFor="servicedate">Start Date:</label>
                <input type="date" id="servicedate" name="servicedate" onChange={(e)=>{setDate(e.target.value)}} value={date}/>
              </div>
              <div className="block">
                <label htmlFor="final-date">Final Date:</label>
                <input type="date" id="final-date" name="final-date" onChange={(e)=>{setFinaldate(e.target.value)}} value={finaldate}/>
              </div>
              <button type="submit" className="submit" onClick={HandleLongSubmit}>Submit</button>
            </fieldset>
          </form>
        )}
        {visible2 && !exit2 && (
          <form ref={shorttermRef} className="popup">
          <button className="exit" onClick={HandleShortExit}>X</button>
          <fieldset>
            <h5>SHORTERM CARE</h5>
            <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(to right, #000000, #1a1a1a, #333333, #4d4d4d, #666666, #4d4d4d, #333333, #1a1a1a, #000000)', width: '90%', margin: '20px ' }} />
            <legend>ENTER VEHICLE INFO</legend>
            <div className="block">
              <label htmlFor="vehicleno">Vehicle No:</label>
              <select name="vehicleno" value={no} onChange={(e)=>{setNo(e.target.value)}}>
                  {!error && Array.isArray(data) && data.map((vehicle,key)=>{ return <option key={key}>{vehicle.VEHICLENO}</option>})}
              </select>
            </div>
            <div className="block">
              <label htmlFor="servicedate">Service Date:</label>
              <input type="date" id="servicedate" name="servicedate" onChange={(e)=>{setDate(e.target.value)}} value={date}/>
            </div>
            <br></br>
            <legend>Enter your desired service:</legend>
            <div className="block">
              <div className="check-block">
                  <input type="checkbox" id="vehiclerepair" name="servicetype" onChange={(e)=>{setRepair(e.target.checked)}} checked={repair}></input>
                  <label htmlFor="vehiclerepair">Repair</label>
              </div>
                <label htmlFor="repairtype">Repair Type </label>
                <textarea id="repairtype" name="repairtype" className="description" onChange={(e)=>{setRepairtype(e.target.value)}} value={repairtype}></textarea>
            </div>
              <div className="block">
                <div className="check-block">
                  <input type="checkbox" id="vehiclewash" name="servicetype" onChange={(e)=>{setWash(e.target.checked)}} checked={wash}/>
                  <label htmlFor="vehiclewash">Wash</label>
                </div>
              <label htmlFor="washtype">Wash Type</label>
              <textarea id="washtype" name="washtype" className="description" onChange={(e)=>{setWashtype(e.target.value)}} value={washtype}></textarea>
            </div>
            <button type="submit" className="submit" onClick={HandleShortSubmit}>Submit</button>
          </fieldset>
        </form>
        )}
        <div className="payment">
        <div className="title">
            <span>History</span>
        </div>
          <table className="history-table">
            <thead>
              <th>Vehicle No.</th>
              <div className="vr"></div>
              <th>Type</th>
              <div className="vr"></div>
              <th>Description</th>
              <div className="vr"></div>
              <th>Date</th>
              <div className="vr"></div>
              <th>Amount(Tk)</th>
            </thead>
            <tbody>
              {!error && shortBill?.map((bill,key)=>{
                return( <tr key={key} className="rows">
                  <td>{bill.VEHICLENO}</td>
                  <div className="vr"></div>
                  <td>{bill.SERVICE_TYPE}</td>
                  <div className="vr"></div>
                  <td>{bill.REPAIR?bill.REPAIR.TYPE:'N/A'} {bill.WASH?bill.WASH.TYPE:'N/A'}</td>
                  <div className="vr"></div>
                  <td>{bill.SERVICE_DATE}</td>
                  <div className="vr"></div>
                  <td>{bill.SERVICING_COST}</td>
                </tr>);
              })}
            </tbody>
            <tbody>
              {!error && longBill?.map((bill,key)=>{
                return( <tr key={key} className="rows">
                  <td>{bill.VEHICLENO}</td>
                  <div className="vr"></div>
                  <td>{bill.SERVICE_TYPE}</td>
                  <div className="vr"></div>
                  <td>{bill.MAINTENANCE_CATEGORY}</td>
                  <div className="vr"></div>
                  <td>{bill.SERVICE_DATE}</td>
                  <div className="vr"></div>
                  <td>{bill.SERVICING_COST}</td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
    </div>
  );
}

export default CareUser;






/* <div className="block">
              <label htmlFor="vehicletype">Vehicle Type:</label>
              <input type="text" id="vehicletype" name="vehicletype" onChange={(e)=>{setType(e.target.value)}} value={type}/>
            </div>
            <div className="block">
            <label htmlFor="vehiclemodel">Vehicle Model:</label>
            <input type="text" id="vehiclemodel" name="vehiclemodel" onChange={(e)=>{setModel(e.target.value)}} value={model}/>
            </div>
            <div className="block">
              <label htmlFor="vehiclecompany">Vehicle Company:</label>
              <input type="text" id="vehiclecompany" name="vehiclecompany" onChange={(e)=>{setCompany(e.target.value)}} value={company}/>
            </div>
            <div className="block">
              <label htmlFor="vehiclecolor">Vehicle Color:</label>
              <input type="text" id="vehiclecolor" name="vehiclecolor" onChange={(e)=>{setColor(e.target.value)}} value={color}/>
            </div> */
import '../styles/admin.css';
import '../styles/chart.css'
import DoughnutChart from '../components/DhoughnutChart';
import LineChart from '../components/LineChart';
import LongRecord from '../components/LongRecord';
import { Link } from 'react-router-dom';


const CareAdmin = () => {

    return ( 
        <div className='admin'>
            <h2>Admin DashBoard (Care & Maintenance)</h2>
            <hr/>
            <br></br>
            <div className='chart-comps'>
              <LineChart/>
              <DoughnutChart/>
            </div>
            <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Link to="/vehiclecare/admin/short-record">
              <button>Shorterm Record</button>
            </Link>
            <Link to="/vehiclecare/admin/long-record">
              <button>Longterm Record</button>
            </Link>
            </div>
        </div>
     );
}
 
export default CareAdmin;

import '../styles/admin.css';
import '../styles/chart.css'
import DoughnutChart from '../components/DhoughnutChart';
import LineChart from '../components/LineChart';
import { Link } from 'react-router-dom';


const CareAdmin = () => {

    return ( 
        <div className='admin'>
            <div className='header-container'>
              <h3>Admin DashBoard <br/> (Care & Maintenance)</h3>
              <hr/>
            </div>
            <div className='chart-comps'>
              <LineChart/>
              <DoughnutChart/>
            </div>
            <div className='button-container'>
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

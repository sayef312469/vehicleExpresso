import '../styles/admin.css';
import '../styles/chart.css'
import DoughnutChart from '../components/DhoughnutChart';
import LineChart from '../components/LineChart';
import { Link } from 'react-router-dom';
import { AiOutlineTool } from 'react-icons/ai';
import { FaTools } from 'react-icons/fa';
import { ReactComponent as  adminCare } from '../img/adminCare.svg' 


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
              <img src={adminCare} alt='admin care'/>
              <Link to="/vehiclecare/admin/short-record">
                <div className='short-button'>
                  <AiOutlineTool style={{color: '#ddd'}}/>
                  <button>Shorterm Record</button>
                </div>
              </Link>
              <Link to="/vehiclecare/admin/long-record">
                <div>
                  <FaTools style={{color: '#ddd'}}/>
                  <button>Longterm Record</button>
                </div>
              </Link>
            </div>
        </div>
     );
}
 
export default CareAdmin;

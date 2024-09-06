import '../styles/admin.css';
import '../styles/chart.css'
import DoughnutChart from '../components/DhoughnutChart';
import LineChart from '../components/LineChart';
import { Link } from 'react-router-dom';
import { AiOutlineTool } from 'react-icons/ai';
import { FaTools } from 'react-icons/fa';


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
            <div className='animation-container'>
              <img src="https://vehiclecare.blob.core.windows.net/vehiclecare/adminCare.svg" alt='admin care'/>
              <div>
                <Link to="/vehiclecare/admin/short-record" style={{textDecoration: 'none'}}>
                <div className='short-button'>
                  <button>
                    <AiOutlineTool style={{color: '#333'}}/>
                    Shorterm Record
                  </button>
                </div>
                </Link>
                <Link to="/vehiclecare/admin/long-record" style={{textDecoration: 'none'}}>
                  <div className='long-button'>
                    <button>
                      <FaTools style={{color: '#333'}}/>
                      Longterm Record
                    </button>
                  </div>
                </Link>
              </div>
            </div>
        </div>
     );
}
 
export default CareAdmin;

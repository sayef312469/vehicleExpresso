import { Link } from "react-router-dom";
const VehicleCare = () => {
    return ( 
    <div>
        <div className="routes">
            <span>Enter as Admin:</span>
            <Link to={`/vehiclecare/admin`}>ADMIN</Link><br></br>
            <span>Enter as a User:</span>
            <Link to={`/vehiclecare/user`}>USER</Link>
        </div>
    </div> 
    );
}
 
export default VehicleCare;
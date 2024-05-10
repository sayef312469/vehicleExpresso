import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarTop from "./components/NavbarTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SearchParking from "./pages/SearchPaking";
import Signup from "./pages/Signup";
import { useAuthContext } from "./hooks/useAuthContext";
import CarWashRepair from "./pages/CarWashRepair";
import PickupVanService from "./pages/PickupVanService";
import RentingCars from "./pages/RentingCars";
import LongTermCare from "./pages/LongTermCare";
import CarInsuranceRenewal from "./pages/CarInsuranceRenewal";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <NavbarTop />
        <div className="pages">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route path="/searchparks" element={<SearchParking />} />
              <Route
                path="/carwashrepair"
                element={user ? <CarWashRepair /> : <Navigate to="/login" />}
              />
              <Route
                path="/pickupvanservice"
                element={user ? <PickupVanService /> : <Navigate to="/login" />}
              />
              <Route
                path="/rentingcars"
                element={user ? <RentingCars /> : <Navigate to="/login" />}
              />
              <Route
                path="/longtermcare"
                element={user ? <LongTermCare /> : <Navigate to="/login" />}
              />
              <Route
                path="/carinsurancerenewal"
                element={
                  user ? <CarInsuranceRenewal /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LongRecord from './components/LongRecord'
import NavbarTop from './components/NavbarTop'
import ShortRecord from './components/ShortRecord'
import SmallCardServices from './components/SmallCardServices'
import { useAuthContext } from './hooks/useAuthContext'
import AddParkAdmin from './pages/AddParkAdmin'
import AddRentInfo from './pages/AddRentInfo'
import AddVehicle from './pages/AddVehicle'
import CarInsuranceRenewal from './pages/CarInsuranceRenewal'
import CareAdmin from './pages/CareAdmin'
import CareUser from './pages/CareUser'
import GarageAdminPay from './pages/GarageAdminPay'
import Home from './pages/Home'
import Login from './pages/Login'
import Notification from './pages/Notification'
import ParkHistory from './pages/ParkHistory'
import PickupVanService from './pages/PickupVanService'
import RentingCars from './pages/RentingCars'
import SearchParking from './pages/SearchPaking'
import Signup from './pages/Signup'
import UserParkHistory from './pages/UserParkHistory'
import VehicleCare from './pages/VehicleCare'
import VehicleEntryExit from './pages/VehicleEntryExit'
import Wavy from './pages/Wavy'
import RecordHistory from './pages/record'
import Profile from './pages/userProfile'

function App() {
  const { user } = useAuthContext()
  console.log('login user: ', user)

  return (
    <div>
      <BrowserRouter>
        <NavbarTop />
        <Wavy />
        <div className="pages">
          <main>
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route
                path="/searchparks"
                element={<SearchParking />}
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
                path="/vehiclecare"
                element={user ? <VehicleCare /> : <Navigate to="/login" />}
              />
              <Route
                path="/vehiclecare/admin"
                element={user ? <CareAdmin /> : <Navigate to="/login" />}
              />
              <Route
                path="/vehiclecare/admin/short-record"
                element={user ? <ShortRecord /> : <Navigate to="/login" />}
              />
              <Route
                path="/vehiclecare/admin/long-record"
                element={user ? <LongRecord /> : <Navigate to="/login" />}
              />
              <Route
                path="/vehiclecare/user"
                element={user ? <CareUser /> : <Navigate to="/login" />}
              />
              <Route
                path="/carinsurancerenewal"
                element={
                  user ? <CarInsuranceRenewal /> : <Navigate to="/login" />
                }
              />
              {user && (
                <Route
                  path="/addparkadmin"
                  element={
                    user.id < 100 ? <AddParkAdmin /> : <Navigate to="/" />
                  }
                />
              )}
              {user && (
                <Route
                  path="/addvehicle"
                  element={<AddVehicle />}
                />
              )}
              {user && (
                <Route
                  path="/vehicleentryexit"
                  element={
                    user.parkAdmin ? (
                      <VehicleEntryExit />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              )}
              {user && (
                <Route
                  path="/addrentinfo"
                  element={
                    user.parkAdmin ? <AddRentInfo /> : <Navigate to="/login" />
                  }
                />
              )}
              {user && (
                <Route
                  path="/userparkhistory"
                  element={
                    user ? <UserParkHistory /> : <Navigate to="/login" />
                  }
                />
              )}
              {user && (
                <Route
                  path="/parkhistory"
                  element={user ? <ParkHistory /> : <Navigate to="/login" />}
                />
              )}
              {user && (
                <Route
                  path="/garageadminpay"
                  element={
                    user.id < 100 ? (
                      <GarageAdminPay />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              )}
              {user && (
                <Route
                  path="/notification"
                  element={user ? <Notification /> : <Navigate to="/login" />}
                />
              )}
              {user && (
                <Route
                  path="/profile"
                  element={user ? <Profile /> : <Navigate to="/login" />}
                />
              )}
              {user && (
                <Route
                  path="/record"
                  element={user ? <RecordHistory /> : <Navigate to="/login" />}
                />
              )}
              <Route
                path="/smallcardservices"
                element={<SmallCardServices />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App

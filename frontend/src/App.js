import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NavbarTop from './components/NavbarTop'
import SmallCardServices from './components/SmallCardServices'
import { useAuthContext } from './hooks/useAuthContext'
import AddParkAdmin from './pages/AddParkAdmin'
import AddRentInfo from './pages/AddRentInfo'
import AddVehicle from './pages/AddVehicle'
import CarInsuranceRenewal from './pages/CarInsuranceRenewal'
import CareAdmin from './pages/CareAdmin'
import CareUser from './pages/CareUser'
import ChatAdmin from './pages/ChatAdmin'
import GarageAdminPay from './pages/GarageAdminPay'
import Home from './pages/Home'
import Login from './pages/Login'
import LongRecord from './pages/LongRecord'
import Notification from './pages/Notification'
import ParkHistory from './pages/ParkHistory'
import PickupVanService from './pages/PickupVanService'
import RentingCars from './pages/RentingCars'
import SearchParking from './pages/SearchPaking'
import ShortRecord from './pages/ShortRecord'
import Signup from './pages/Signup'
import UserParkHistory from './pages/UserParkHistory'
import VehicleEntryExit from './pages/VehicleEntryExit'
import Wavy from './pages/Wavy'
import Dashboard from './pages/dashboard'
import RecordHistory from './pages/record'
import Profile from './pages/userProfile'
import PurchaseHistory from './pages/PurchaseHistory'

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
                path="/pickupvanservice"
                element={user ? <PickupVanService /> : <Navigate to="/login" />}
              />
              <Route
                path="/rentingcars"
                element={user ? <RentingCars /> : <Navigate to="/login" />}
              />

              <Route
                path="/vehiclecare/user"
                element={user ? <CareUser /> : <Navigate to="/login" />}
              />

              <Route
                path="/vehiclecare/admin"
                element={
                  user && user.id < 100 ? (
                    <CareAdmin />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/vehiclecare/admin/short-record"
                element={
                  user && user.id < 100 ? (
                    <ShortRecord />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/vehiclecare/admin/long-record"
                element={
                  user && user.id < 100 ? (
                    <LongRecord />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/vehiclecare/admin/chat"
                element={
                  user && user.id < 100 ? (
                    <ChatAdmin />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/myshop"
                element={
                  user ? <CarInsuranceRenewal /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/addparkadmin"
                element={
                  user && user.id < 100 ? <AddParkAdmin /> : <Navigate to="/" />
                }
              />

              <Route
                path="/addvehicle"
                element={user ? <AddVehicle /> : <Navigate to="/login" />}
              />

              <Route
                path="/vehicleentryexit"
                element={
                  user && user.parkAdmin ? (
                    <VehicleEntryExit />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/addrentinfo"
                element={
                  user && user.parkAdmin ? (
                    <AddRentInfo />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/userparkhistory"
                element={user ? <UserParkHistory /> : <Navigate to="/login" />}
              />

              <Route
                path="/parkhistory"
                element={user ? <ParkHistory /> : <Navigate to="/login" />}
              />

              <Route
                path="/garageadminpay"
                element={
                  user && user.id < 100 ? (
                    <GarageAdminPay />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/notification"
                element={user ? <Notification /> : <Navigate to="/login" />}
              />

              <Route
                path="/profile"
                element={user ? <Profile /> : <Navigate to="/login" />}
              />

              <Route
                path="/record"
                element={user ? <RecordHistory /> : <Navigate to="/login" />}
              />

              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />

              <Route
                path="/purchasehistory"
                element={user ? <PurchaseHistory /> : <Navigate to="/login" />}
              />

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

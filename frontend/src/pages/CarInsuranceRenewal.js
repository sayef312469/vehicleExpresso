import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Shop from '../components/Shop'
import { CartProvider } from '../context/CartContext'
import '../styles/shop.css'

function CarInsuranceRenewal() {
  return (
    <div style={{ width: '100%' }}>
      <CartProvider>
        <div className="product">
          <header className="bg-black text-white text-center py-3">
            <h1>My Shop</h1>
          </header>
          <Shop />
        </div>
        <ToastContainer />
      </CartProvider>
    </div>
  )
}

export default CarInsuranceRenewal

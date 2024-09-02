import React, { createContext, useState, useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css'

const CartContext = createContext()

export const useCart = () => {
  return useContext(CartContext)
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Updated addToCart function to handle quantities
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.PRODUCT_ID === product.PRODUCT_ID
      )
      if (existingProduct) {
        // If the product is already in the cart, update the quantity
        return prevCart.map((item) =>
          item.PRODUCT_ID === product.PRODUCT_ID
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      } else {
        // Otherwise, add the new product to the cart
        return [...prevCart, product]
      }
    })
  }

  const removeFromCart = (productId) => {
    console.log('Removing product with id:', productId)
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item.PRODUCT_ID !== productId
      )
      console.log('Updated cart:', updatedCart)
      return updatedCart
    })
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { Container, Row, Col, Alert, ListGroup, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import PaymentModal from './PaymentModal'
import 'react-toastify/dist/ReactToastify.css'

const Cart = ({ restoreQuantity }) => {
  const { cart, removeFromCart } = useCart()
  const [showModal, setShowModal] = useState(false)

  // Function to calculate the total price of items in the cart
  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.SELLER_PRICE * item.quantity,
      0
    )
  }

  const handleRemoveFromCart = (product) => {
    removeFromCart(product.PRODUCT_ID)
    restoreQuantity(product.PRODUCT_ID, product.quantity)
  }

  const handlePayment = (method) => {
    toast.success(`Payment successful with ${method}`)
  }

  const totalPrice = calculateTotalPrice()

  return (
    <Container className="mt-2 cart">
      <Row>
        <Col>
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <Alert variant="info">Your cart is empty</Alert>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item
                  key={item.PRODUCT_ID}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.PRODUCT_NAME}</strong> <br />
                    <span>${item.SELLER_PRICE.toFixed(2)}</span>
                    <br />
                    <span className="quantity">
                      Quantity: {item.quantity}
                    </span>{' '}
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFromCart(item)}
                  >
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <strong>Total:</strong> ${totalPrice.toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <button className="Btn" onClick={() => setShowModal(true)}>
                  Pay
                  <svg viewBox="0 0 576 512" className="svgIcon">
                    <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path>
                  </svg>
                </button>
              </ListGroup.Item>
            </ListGroup>
          )}
        </Col>
      </Row>

      <PaymentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handlePayment={handlePayment}
        totalPrice={totalPrice}
        cartItems={cart}
      />
    </Container>
  )
}

export default Cart

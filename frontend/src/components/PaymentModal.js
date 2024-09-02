import React, { useState, useEffect } from 'react'
import { Modal, Form, Row, Col } from 'react-bootstrap'
import { useAuthContext } from '../hooks/useAuthContext'
import { useCart } from '../context/CartContext'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { toast } from 'react-toastify'

const PaymentModal = ({
  show,
  handleClose,
  handlePayment,
  totalPrice,
  cartItems,
}) => {
  const { clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('Card')
  const [userDetail, setUserDetail] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [discountPrice, setDiscountPrice] = useState(0)
  const [bkashNumber, setBkashNumber] = useState('')
  const { user } = useAuthContext()
  const tax = totalPrice * 0.15
  const [formData, setFormData] = useState({
    cardType: '',
    cardHolderName: '',
    cardNumber: '',
    cardExpiryDate: '',
    cvv: '',
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (paymentMethod === 'Card') {
      if (!formData.cardType) newErrors.cardType = 'Card type is required'
      if (!formData.cardHolderName)
        newErrors.cardHolderName = 'Card holder name is required'
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
      if (!formData.cardExpiryDate)
        newErrors.cardExpiryDate = 'Card expiry date is required'
      if (!formData.cvv) newErrors.cvv = 'CVV is required'
    } else if (paymentMethod === 'Bkash') {
      if (!bkashNumber) newErrors.bkashNumber = 'BKash number is required'
    }
    return newErrors
  }

  const handleCheckout = () => {
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    handleUpdateStock()
    handlePurchase()
    handlePaymentSubmit()
    setDiscountPrice(0)
    setPromoCode('')
    setBkashNumber('')
    setFormData({
      cardType: '',
      cardHolderName: '',
      cardNumber: '',
      cardExpiryDate: '',
      cvv: '',
    })
  }

  const clearErrors = () => {
    setErrors({})
    setDiscountPrice(0)
    setPromoCode('')
  }

  const handleModalClose = () => {
    clearErrors()
    handleClose()
  }

  const handlePromoCode = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/shop/promo-code?promoCode=${promoCode}&buyer_id=${user.id}`
      )
      console.log(response)
      const data = await response.json()
      console.log(data)
      const formatDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      const dateToday = new Date()
      const formattedDateToday = formatDate(dateToday)
      console.log(formattedDateToday)
      if (
        response.ok &&
        data.START_DATE <= formattedDateToday &&
        data.END_DATE >= formattedDateToday
      ) {
        if (
          (data.DISCOUNT_PERCENTAGE / 100) * totalPrice <=
          data.MAX_DISCOUNT
        ) {
          setDiscountPrice((data.DISCOUNT_PERCENTAGE / 100) * totalPrice)
        } else {
          setDiscountPrice(data.MAX_DISCOUNT)
        }
        toast.success('Promo code applied successfully')
      } else {
        toast.error("Promo code doesn't exist")
        console.log(data.error)
      }
    } catch (error) {
      toast.error('Please try again later')
      console.error('Error applying promo code:', error)
    }
  }

  const handlePaymentSubmit = () => {
    const doc = new jsPDF()

    // Add company logo
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    const logo = 'data:image/jpeg;base64,...' // Replace with your base64 encoded logo
    doc.addImage(logo, 'JPEG', 15, 10, 50, 20)

    // Add company name and address

    doc.text('Company Name', 105, 15, null, null, 'center')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('1234 Company Address', 105, 20, null, null, 'center')
    doc.text('City, State, ZIP', 105, 25, null, null, 'center')
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Receipt', 105, 35, null, null, 'center')

    // Add a line below the header
    doc.setLineWidth(0.5)
    doc.setDrawColor(0, 0, 0)
    doc.line(15, 40, 195, 40)

    //Add customer details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Customer Name: ${userDetail.NAME}`, 15, 50)
    doc.text(
      `Shipping Address: ${userDetail.AREA}, ${userDetail.CITY}, ${userDetail.COUNTRY}`,
      15,
      55
    )
    doc.text(`Payment Method: ${paymentMethod}`, 15, 60)

    doc.line(15, 67, 195, 67)

    // Add item table
    const tableColumn = ['Item', 'Quantity', 'Price', 'Total']
    const tableRows = []

    cartItems.forEach((item) => {
      const itemData = [
        item.PRODUCT_NAME,
        item.quantity,
        `$${item.SELLER_PRICE.toFixed(2)}`,
        `$${(item.SELLER_PRICE * item.quantity).toFixed(2)}`,
      ]
      tableRows.push(itemData)
    })

    // Calculate the subtotal
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.SELLER_PRICE * item.quantity,
      0
    )

    tableRows.push(['Subtotal', '', '', `$${subtotal.toFixed(2)}`])

    const tax = subtotal * 0.15
    const shipping = 10
    const grandTotal = subtotal + tax + shipping

    // Add tax, shipping, and total
    tableRows.push(['Tax (15%)', '', '', `$${tax.toFixed(2)}`])
    tableRows.push(['Shipping', '', '', `$${shipping.toFixed(2)}`])
    if (discountPrice > 0) {
      tableRows.push(['Discount', '', '', `-$${discountPrice.toFixed(2)}`])
    }
    tableRows.push(['Total', '', '', `$${grandTotal.toFixed(2)}`])

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 77,
      theme: 'striped',
      headStyles: { fillColor: [255, 0, 0] },
      footStyles: { fillColor: [240, 240, 240] },
    })

    const finalY = doc.previousAutoTable.finalY || 92
    // Add footer
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text(
      'Thank you for your purchase!',
      105,
      finalY + 15,
      null,
      null,
      'center'
    )

    // Save the PDF
    doc.save('receipt.pdf')

    // Simulate payment processing here
    handlePayment(paymentMethod)
    clearCart()
    handleClose()
  }

  const handleUpdateStock = async () => {
    try {
      const response = await fetch(
        'http://localhost:4000/api/shop/update-stock',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            products: cartItems.map((item) => ({
              id: item.PRODUCT_ID,
              stock: item.SELLER_STOCK - item.quantity,
            })),
          }),
        }
      )
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        console.log(data.message)
      } else {
        console.log(data.error)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const handlePurchase = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/shop/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerId: user.id,
          paymentOption: paymentMethod,
          totalPrice: totalPrice,
          cartItems: cartItems,
          cardDetails: formData,
          bkashAccount: bkashNumber,
          discountPrice: discountPrice,
          promoCode: promoCode,
        }),
      })
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        console.log(data.message)
      } else {
        console.log(data.error)
      }
    } catch (error) {
      console.error('Error creating purchase:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/api/user/profile/' + user.id
        )
        const data = await response.json()
        if (response.ok) {
          setUserDetail(data)
          console.log(data)
        } else {
          console.log(data.error)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [user])

  return (
    <Modal show={show} onHide={handleModalClose} className="transparent-modal">
      <div className="container777">
        <div className="card97 cart55">
          <Modal.Header closeButton className="title22">
            CHECKOUT
          </Modal.Header>
          <div className="steps">
            <div className="step">
              <div>
                <span>SHIPPING</span>
                <p>{userDetail.AREA}</p>
                <p style={{ lineHeight: '0' }}>
                  {userDetail.CITY}, {userDetail.COUNTRY}
                </p>
              </div>
              <hr />
              <div style={{ position: 'relative', top: '-10px' }}>
                <Form>
                  <Form.Group controlId="formPaymentMethod">
                    <Form.Label style={{ fontWeight: '600', fontSize: '13px' }}>
                      PAYMENT METHOD
                    </Form.Label>
                    <div className="custom-select-container">
                      <Form.Control
                        as="select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="custom-select"
                        style={{ fontWeight: '600', fontSize: '12px' }}
                      >
                        <option
                          value="Card"
                          style={{ fontWeight: '600', fontSize: '12px' }}
                        >
                          Credit/Debit Card
                        </option>
                        <option
                          value="Bkash"
                          style={{ fontWeight: '600', fontSize: '12px' }}
                        >
                          BKash
                        </option>
                        <option
                          value="Cash"
                          style={{ fontWeight: '600', fontSize: '12px' }}
                        >
                          Cash on Delivery
                        </option>
                      </Form.Control>
                    </div>
                  </Form.Group>
                  {paymentMethod === 'Card' && (
                    <Form.Group controlId="formCardInfo">
                      <Form.Label
                        style={{ fontWeight: '600', fontSize: '13px' }}
                      >
                        Card Information
                      </Form.Label>
                      <div className="radio-container">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="cardType"
                            value="Visa"
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                            alt="Visa"
                            style={{
                              width: '30px',
                              marginRight: '10px',
                            }}
                          />
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="cardType"
                            value="Mastercard"
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                            alt="Mastercard"
                            style={{ width: '30px', marginRight: '10px' }}
                          />
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="cardType"
                            value="American Express"
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                            alt="American Express"
                            style={{
                              width: '30px',
                              marginRight: '10px',
                            }}
                          />
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="cardType"
                            value="Discover"
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg"
                            alt="Discover"
                            style={{
                              width: '50px',
                              marginRight: '10px',
                            }}
                          />
                        </label>
                      </div>
                      {errors.cardType && (
                        <div className="error">{errors.cardType}</div>
                      )}
                      <Form.Control
                        type="text"
                        placeholder="Card Holder Name"
                        name="cardHolderName"
                        value={formData.cardHolderName}
                        onChange={handleInputChange}
                        style={{ fontWeight: '600', fontSize: '12px' }}
                        className="input_field793"
                      />
                      {errors.cardHolderName && (
                        <div className="error">{errors.cardHolderName}</div>
                      )}
                      <Form.Control
                        type="text"
                        placeholder="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        style={{
                          fontWeight: '600',
                          fontSize: '12px',
                          marginTop: '10px',
                        }}
                        className="input_field793"
                      />
                      {errors.cardNumber && (
                        <div className="error">{errors.cardNumber}</div>
                      )}
                      <Form.Control
                        type="date"
                        placeholder="Card Expiry Date(MM/YY)"
                        name="cardExpiryDate"
                        value={formData.cardExpiryDate}
                        onChange={handleInputChange}
                        style={{
                          fontWeight: '600',
                          fontSize: '12px',
                          marginTop: '10px',
                        }}
                        className="input_field793"
                      />
                      {errors.cardExpiryDate && (
                        <div className="error">{errors.cardExpiryDate}</div>
                      )}
                      <Form.Control
                        type="text"
                        placeholder="CVV(4-digit)"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        style={{
                          fontWeight: '600',
                          fontSize: '12px',
                          marginTop: '10px',
                        }}
                        className="input_field793"
                      />
                      {errors.cvv && <div className="error">{errors.cvv}</div>}
                    </Form.Group>
                  )}

                  {paymentMethod === 'Bkash' && (
                    <Form.Group controlId="formBkashNumber">
                      <Form.Label
                        style={{ fontWeight: '600', fontSize: '13px' }}
                      >
                        BKash Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter BKash Number"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        style={{ fontWeight: '600', fontSize: '12px' }}
                        className="input_field793"
                      />
                      {errors.bkashNumber && (
                        <div className="error">{errors.bkashNumber}</div>
                      )}
                    </Form.Group>
                  )}
                </Form>
              </div>
              <hr />
              <div className="promo93">
                <span>HAVE A PROMO CODE?</span>
                <form className="form000">
                  <input
                    type="text"
                    placeholder="Enter a Promo Code"
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="input_field93"
                    style={{ fontWeight: '600', fontSize: '12px' }}
                  />
                  <button type="button" onClick={handlePromoCode}>
                    Apply
                  </button>
                </form>
              </div>
              <hr />
              <div className="payments01">
                <span>PAYMENT</span>
                <Row>
                  <Col md={1}>
                    <span>Sl.</span>
                  </Col>
                  <Col md={3}>
                    <span>Item</span>
                  </Col>
                  <Col md={3}>
                    <span>Quantity</span>
                  </Col>
                  <Col md={2}>
                    <span>Price</span>
                  </Col>
                  <Col md={3} style={{ textAlign: 'right' }}>
                    <span>Total</span>
                  </Col>
                </Row>
                {cartItems.map((item, index) => (
                  <Row key={item.PRODUCT_ID}>
                    <Col md={1}>
                      <span>{index + 1}</span>
                    </Col>
                    <Col md={3}>
                      <span>{item.PRODUCT_NAME}</span>
                    </Col>
                    <Col md={3}>
                      <span>{item.quantity}</span>
                    </Col>
                    <Col md={2}>
                      <span>${item.SELLER_PRICE.toFixed(2)}</span>
                    </Col>
                    <Col md={3} style={{ textAlign: 'right' }}>
                      <span>
                        ${(item.SELLER_PRICE * item.quantity).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                ))}
                <div className="details">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                  <span>Shipping:</span>
                  <span>$10.00</span>
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                  {discountPrice > 0 && (
                    <>
                      <span>Discount:</span>
                      <span>-${discountPrice.toFixed(2)}</span>
                    </>
                  )}
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>

        <div className="card97 checkout">
          <div className="footer3333">
            <label className="price">
              ${(totalPrice + tax + 10 - discountPrice).toFixed(2)}
            </label>
            <button
              className="checkout-btn"
              type="button"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentModal

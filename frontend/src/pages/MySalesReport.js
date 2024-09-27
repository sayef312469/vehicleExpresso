import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { Card, Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import '../styles/shop.css'
import { squircle } from 'ldrs'
squircle.register()

const SalesReport = () => {
  const { user } = useAuthContext()
  const sellerId = user.id
  const [searchTerm, setSearchTerm] = useState('')
  const [salesData, setSalesData] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSalesData()
  }, [sellerId])

  useEffect(() => {
    fetchSalesData()
  }, [searchTerm])

  const fetchSalesData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:4000/api/shop/sales/${sellerId}?searchTerm=${searchTerm}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      const data = await response.json()
      setSalesData(data)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.message)
      setSalesData([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleChange = (event) => {
    handleSearch(event)
    fetchSalesData()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      fetchSalesData()
    }
  }

  const truncateDescription = (description, limit) => {
    if (description.length <= limit) {
      return description
    }
    return description.substring(0, limit) + '...'
  }

  return (
    <Container className="sales-report-container">
      <h2 className="my-4 text-center">Sales Report</h2>

      <Form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <Row>
          <Col xs={9}>
            <Form.Control
              type="text"
              placeholder="Search by Product Name"
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="input"
            />
          </Col>
          <Col xs={3}>
            <Button
              variant="primary"
              onClick={fetchSalesData}
              className="unique-search-button w-100"
            >
              <b>Search</b>
            </Button>
          </Col>
        </Row>
      </Form>

      {errorMessage && (
        <Alert variant="danger" className="alert73 unique-error-message">
          {errorMessage}
        </Alert>
      )}

      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <l-squircle
            size="37"
            stroke="5"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="0.9"
            color="rgba(33, 244, 177, 0.653)"
          ></l-squircle>
        </div>
      )}

      <Row>
        {salesData.length > 0
          ? salesData.map((sale) => (
              <Col md={6} lg={4} className="mb-4" key={sale.PRODUCT_ID}>
                <Card className="sales-card h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      sale.PRODUCT_IMAGE_URL ||
                      'https://via.placeholder.com/150'
                    }
                    alt={sale.PRODUCT_NAME}
                    className="product-image83"
                  />
                  <Card.Body className="card-body91">
                    <Card.Title className="card-title91">
                      {sale.PRODUCT_NAME}
                    </Card.Title>
                    <Card.Text className="card-text91">
                      <strong>Description:</strong>{' '}
                      {truncateDescription(sale.PRODUCT_DESCRIPTION, 38) + ' '}
                    </Card.Text>
                    <Card.Text className="card-text91">
                      <strong>Category:</strong> {sale.PRODUCT_CATEGORY}
                    </Card.Text>
                    <Card.Text className="card-text91">
                      <strong>Stock Available:</strong> {sale.SELLER_STOCK}
                    </Card.Text>
                    <Card.Text className="card-text91">
                      <strong>Total Quantity Sold:</strong>{' '}
                      {sale.TOTAL_QUANTITY}
                    </Card.Text>
                    <Card.Text className="card-text91">
                      <strong>Last Purchase Date:</strong>{' '}
                      {new Date(sale.LAST_PURCHASE_DATE).toLocaleString()}
                    </Card.Text>
                    <Card.Text className="card-text91">
                      <strong>Product Status:</strong>{' '}
                      {sale.STATUS === 1 ? (
                        <span style={{ color: 'black' }}>Active</span>
                      ) : (
                        <span style={{ color: 'red' }}>Archived</span>
                      )}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-muted card-footer91">
                    <Row>
                      <Col style={{ textAlign: 'center' }}>
                        <strong>Item Price:</strong> $
                        {sale.ITEM_PRICE.toFixed(2)}
                      </Col>
                      <Col style={{ textAlign: 'center' }}>
                        <strong>Discounts:</strong> $
                        {sale.TOTAL_DISCOUNT.toFixed(2)}
                      </Col>
                      <Col style={{ textAlign: 'center' }}>
                        <strong>Total Sales:</strong> $
                        {sale.TOTAL_PRICE.toFixed(2)}
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          : !loading &&
            !errorMessage && (
              <div className="text-center w-100 unique-error-message">
                No sales data available.
              </div>
            )}
      </Row>
    </Container>
  )
}

export default SalesReport

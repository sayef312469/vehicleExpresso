import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Table, Container, Alert, Pagination } from 'react-bootstrap'
import { useAuthContext } from '../hooks/useAuthContext'
import '../styles/shop.css'
import { squircle } from 'ldrs'
squircle.register()

const PurchaseHistory = () => {
  const { user } = useAuthContext()
  const [purchaseHistory, setPurchaseHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)
  const [totalPages, setTotalPages] = useState(0)

  const fetchPurchaseHistory = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:4000/api/shop/purchase-history/${user.id}`,
        {
          params: { page, pageSize },
        }
      )

      const { purchases, totalPages: fetchedTotalPages } = response.data

      setPurchaseHistory(purchases)
      setTotalPages(fetchedTotalPages)
      setError(null)
    } catch (error) {
      setError('Failed to load purchase history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchaseHistory(currentPage)
  }, [currentPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const renderPagination = () => {
    let items = []
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      )
    }
    return <Pagination className="custom-pagination1">{items}</Pagination>
  }

  if (loading) {
    return (
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
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <Container className="purchase-history-container">
      <h2 className="purchase-history-heading">Purchase History</h2>
      {purchaseHistory.length > 0 ? (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="purchase-history-table"
          >
            <thead>
              <tr>
                <th>Purchase ID</th>
                <th>Product Details</th>
                <th>Payment Option</th>
                <th>Purchase Date</th>
                <th>Promo Code</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((purchase) => (
                <tr key={purchase.PURCHASE_ID}>
                  <td>{purchase.PURCHASE_ID}</td>
                  <td>
                    <Table striped bordered className="inner-product-table">
                      <thead>
                        <tr>
                          <th>Product ID</th>
                          <th>Item Price</th>
                          <th>Quantity</th>
                          <th>Total Price</th>
                          <th>Discount Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchase.PRODUCT_DETAILS.split('|').map(
                          (detail, index) => {
                            const [
                              productId,
                              itemPrice,
                              quantity,
                              discountPrice,
                              totalPrice,
                            ] = detail
                              .replace('Product ID: ', '')
                              .replace(' Item Price: ', '')
                              .replace(' Quantity: ', '')
                              .replace(' Discount Price: ', '')
                              .replace(' Total Price: ', '')
                              .split(',')

                            return (
                              <tr key={index}>
                                <td>{productId}</td>
                                <td>${parseFloat(itemPrice).toFixed(2)}</td>
                                <td>{quantity}</td>
                                <td>${parseFloat(totalPrice).toFixed(2)}</td>
                                {index === 0 ? (
                                  <td
                                    rowSpan={
                                      purchase.PRODUCT_DETAILS.split('|').length
                                    }
                                  >
                                    ${parseFloat(discountPrice).toFixed(2)}
                                  </td>
                                ) : null}
                              </tr>
                            )
                          }
                        )}
                      </tbody>
                    </Table>
                  </td>
                  <td>{purchase.PAYMENT_OPTION}</td>
                  <td>
                    {moment(purchase.PURCHASE_DATE).format(
                      'MMMM Do YYYY, h:mm:ss A'
                    )}
                  </td>
                  <td>{purchase.PROMO_CODE || 'N/A'}</td>
                  <td>${purchase.PURCHASE_TOTAL_PRICE.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {renderPagination()}
        </>
      ) : (
        <p>No purchases found.</p>
      )}
    </Container>
  )
}

export default PurchaseHistory

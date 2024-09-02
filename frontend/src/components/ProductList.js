import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { useAuthContext } from '../hooks/useAuthContext'
import { useDebounce } from '../hooks/useDebounce'
import Cart from '../components/Cart'
import AddProduct from '../components/AddProduct'
import ProductDetail from '../pages/ProductDetail'
import {
  Alert,
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Modal,
  Placeholder,
  Card,
} from 'react-bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const ProductList = () => {
  const { user } = useAuthContext()
  const [userDetail, setUserDetail] = useState('')
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [selectedTag, setSelectedTag] = useState('')

  const [currentView, setCurrentView] = useState('shop')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [stockUpdates, setStockUpdates] = useState({})
  const [myProducts, setMyProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:4000/api/shop/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        const validatedData = data.map((product) => ({
          ...product,
          PRODUCT_NAME: product.PRODUCT_NAME || 'Unnamed Product',
        }))
        setProducts(validatedData)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  const handleMyProductsClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/shop/my-product/${user.id}`
      )
      const products = await response.json()
      setMyProducts(products)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product) // Set the selected product
    setCurrentView('productDetail') // Switch to the product detail view
  }

  const handleBackToShop = () => {
    setCurrentView('shop') // Switch back to the shop view
  }

  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
    setCurrentView('shop')
  }

  const handleAddToCart = (productId, quantity) => {
    if (currentView === 'shop') {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.PRODUCT_ID === productId
            ? {
                ...product,
                SELLER_STOCK: Math.max(0, product.SELLER_STOCK - quantity),
              }
            : product
        )
      )
    } else if (currentView === 'productDetail') {
      setSelectedProduct((prevProduct) => {
        const updatedQuantityAvailable = Math.max(
          0,
          prevProduct.SELLER_STOCK - quantity
        )
        console.log('updatedQuantityAvailable', updatedQuantityAvailable)
        console.log(productId)
        // Update the products array with the new quantityAvailable
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.PRODUCT_ID === productId
              ? {
                  ...product,
                  SELLER_STOCK: updatedQuantityAvailable,
                }
              : product
          )
        )

        return {
          ...prevProduct,
          SELLER_STOCK: updatedQuantityAvailable,
        }
      })
    }
  }

  const restoreQuantity = (productId, quantity) => {
    if (currentView === 'shop') {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.PRODUCT_ID === productId
            ? {
                ...product,
                SELLER_STOCK: product.SELLER_STOCK + quantity,
              }
            : product
        )
      )
    } else if (currentView === 'productDetail') {
      if (selectedProduct.PRODUCT_ID === productId) {
        setSelectedProduct((prevProduct) => {
          const updatedQuantityAvailable = prevProduct.SELLER_STOCK + quantity

          // Update the products array with the new quantityAvailable
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.PRODUCT_ID === productId
                ? {
                    ...product,
                    SELLER_STOCK: updatedQuantityAvailable,
                  }
                : product
            )
          )

          return {
            ...prevProduct,
            SELLER_STOCK: updatedQuantityAvailable,
          }
        })
      } else {
        // If the product is not the selected product, update the quantityAvailable in the products array
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.PRODUCT_ID === productId
              ? {
                  ...product,
                  SELLER_STOCK: product.SELLER_STOCK + quantity,
                }
              : product
          )
        )
      }
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = product.PRODUCT_NAME
      ? product.PRODUCT_NAME.toLowerCase().includes(
          debouncedSearchQuery.toLowerCase()
        )
      : false
    const matchesTag = selectedTag
      ? product.PRODUCT_CATEGORY === selectedTag
      : true
    return matchesSearchQuery && matchesTag
  })

  return (
    <div style={{ width: '100' }}>
      <Row>
        {currentView === 'addProduct' && (
          <AddProduct
            onAddProduct={handleAddProduct}
            onCancel={handleBackToShop}
          />
        )}
        <Col md={9}>
          {currentView === 'shop' && (
            <Container>
              <Row className="align-items-center">
                <Col md={7}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <h1
                      className="text-center mb-4"
                      style={{ paddingTop: '10px', marginBottom: '0' }}
                    >
                      Shop Page
                    </h1>
                  </div>
                </Col>
                <Col md={3} style={{ textAlign: 'right' }}>
                  {user.id < 100 && currentView === 'shop' && (
                    <Button
                      variant="outline-primary"
                      onClick={() => setCurrentView('addProduct')}
                      style={{
                        marginBottom: '20px',
                        borderColor: '#007bff',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition:
                          'background-color 0.3s ease, transform 0.3s ease',
                        backgroundColor: 'transparent',
                        color: '#007bff',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e7f3ff'
                        e.target.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      <i
                        className="bi bi-plus-lg"
                        style={{ marginRight: '10px' }}
                      ></i>
                      Add Product
                    </Button>
                  )}
                </Col>
                <Col md={2}>
                  {user.id < 100 && currentView === 'shop' && (
                    <Button
                      variant="outline-primary"
                      onClick={handleMyProductsClick}
                      style={{
                        marginBottom: '20px',
                        borderColor: '#007bff',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition:
                          'background-color 0.3s ease, transform 0.3s ease',
                        backgroundColor: 'transparent',
                        color: '#007bff',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e7f3ff'
                        e.target.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      My Products
                    </Button>
                  )}
                </Col>
              </Row>
              <div className="group" style={{ paddingTop: '15px' }}>
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input
                  placeholder="Search"
                  type="search"
                  className="input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="filter-container">
                  <Dropdown className="filter-dropdown">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-filter filter-icon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6 10.5V14l4-2.5V10h5.5V7H10V4.5L6 7v3H1.5v3H6z"></path>
                      </svg>
                      {selectedTag ? selectedTag : 'Filter by Tag'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setSelectedTag('')}>
                        All
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSelectedTag('Tyre')}>
                        Tyre
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSelectedTag('Oil')}>
                        Oil
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSelectedTag('Engine')}>
                        Engine
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSelectedTag('Others')}>
                        Others
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <br />
              <br />
              {loading ? (
                <Row xs={1} md={3} className="g-4">
                  {[...Array(6)].map((_, idx) => (
                    <Col key={idx}>
                      <Card>
                        <Card.Img
                          variant="top"
                          src="data:image/svg+xml;charset=UTF-8,<svg width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='%23eee'/></svg>"
                          alt="Placeholder image"
                        />
                        <Card.Body>
                          <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                          </Placeholder>
                          <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7} />
                            <Placeholder xs={4} />
                            <Placeholder xs={4} />
                            <Placeholder xs={6} />
                            <Placeholder xs={8} />
                          </Placeholder>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="row">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.PRODUCT_ID} className="col-md-3 mb-4">
                        <ProductCard
                          key={product.PRODUCT_ID}
                          product={product}
                          onProductClick={() => handleProductClick(product)}
                          handleAddToCart={handleAddToCart}
                        />
                      </div>
                    ))
                  ) : (
                    <Container>
                      <Alert variant="danger">No products found</Alert>
                    </Container>
                  )}
                </div>
              )}
            </Container>
          )}
          {currentView === 'productDetail' && selectedProduct && (
            <ProductDetail
              key={selectedProduct.PRODUCT_ID}
              product={selectedProduct}
              onBackToShop={handleBackToShop}
              handleAddToCart={handleAddToCart}
              userDetail={userDetail}
            />
          )}
        </Col>
        <Col md={3}>
          {(currentView === 'shop' || currentView === 'productDetail') && (
            <Container
              style={{ position: 'sticky', top: '0', paddingTop: '10px' }}
            >
              <Cart restoreQuantity={restoreQuantity} />
            </Container>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ProductList

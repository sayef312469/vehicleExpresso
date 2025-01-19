import React, { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { useAuthContext } from '../hooks/useAuthContext'

const AddProduct = ({ onAddProduct, onCancel }) => {
  const { user } = useAuthContext()
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productTag, setProductTag] = useState('')
  const [productImage, setProductImage] = useState(null)
  const [quantityAvailable, setQuantityAvailable] = useState(0)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      productName &&
      productPrice &&
      productTag &&
      productImage &&
      quantityAvailable
    ) {
      const randomId = Math.floor(Math.random() * 9e8) + 1e8
      onAddProduct({
        PRODUCT_ID: randomId,
        PRODUCT_NAME: productName,
        PRODUCT_DESCRIPTION: productDescription,
        PRODUCT_IMAGE_URL: URL.createObjectURL(productImage),
        PRODUCT_CATEGORY: productTag,
        CREATED_AT: new Date().toISOString(),
        SELLER_ID: user.id,
        SELLER_PRICE: parseFloat(productPrice),
        SELLER_STOCK: parseInt(quantityAvailable),
      })
      setProductName('')
      setProductPrice('')
      setProductDescription('')
      setProductTag('')
      setProductImage(null)
      setQuantityAvailable(0)
      setError('')

      const formData = new FormData()
      formData.append('id', randomId)
      formData.append('name', productName)
      formData.append('description', productDescription)
      formData.append('tag', productTag)
      formData.append('create_date', new Date().toISOString())
      formData.append('sellerId', user.id)
      formData.append('price', parseFloat(productPrice))
      formData.append('quantityAvailable', parseInt(quantityAvailable))
      formData.append('image', productImage)

      try {
        const response = await fetch(
          'http://localhost:4000/api/shop/add-product/',
          {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        if (response.ok) {
          console.log('Product added successfully')
        } else {
          console.error('Error adding product')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    } else {
      setError('Please fill in all the fields')
    }
  }

  if (user.id >= 100) {
    return <Alert variant="danger">Access Denied</Alert>
  }

  return (
    <Container className="add-product-container">
      <h2 className="add-product-title">Add New Product</h2>
      <Form onSubmit={handleSubmit} className="add-product-form">
        <Form.Group controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productPrice">
          <Form.Label>Product Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productDescription">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productTag">
          <Form.Label>Product Tag</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product tag"
            value={productTag}
            onChange={(e) => setProductTag(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productImage">
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group controlId="quantityAvailable">
          <Form.Label>Quantity Available</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter quantity available"
            value={quantityAvailable}
            onChange={(e) => setQuantityAvailable(e.target.value)}
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="button-group">
          <Button variant="primary" type="submit">
            Add Product
          </Button>
          <Button variant="secondary" onClick={onCancel} className="ml-2">
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  )
}

export default AddProduct

// src/components/Footer.js

import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer
      className="footer bg-dark text-light py-4"
      style={{ borderRadius: '15px' }}
    >
      <Container>
        <Row>
          <Col md={6}>
            <p>© 2024 Your Brand. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="#" className="text-light me-3">
              Privacy Policy
            </a>
            <a href="#" className="text-light">
              Terms of Service
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

// src/components/Hero.js
import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

const Hero = () => {
  return (
    <section className="hero-section text-center bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={12}>
            <h1 className="display-4">Welcome to Our Store!</h1>
            <p className="lead">Discover amazing products at great prices.</p>
            <Button variant="primary" size="lg">
              Shop Now
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Hero

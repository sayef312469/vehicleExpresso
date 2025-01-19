import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import useScrollFade from '../hooks/useScrollFade'

const HeroSection = () => {
  useScrollFade('.hero-section1')
  return (
    <div className="hero-section1 text-center text-light d-flex align-items-center">
      <Container fluid>
        <Row>
          <Col>
            <h1 className="display-4">Welcome to Your Brand</h1>
            <p className="lead">
              Revolutionizing the way you manage your work.
            </p>
            <Button variant="primary" size="lg" href="#features">
              Learn More
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default HeroSection

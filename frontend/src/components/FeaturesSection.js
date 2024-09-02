// src/components/FeaturesSection.js

import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { FaRocket, FaShieldAlt, FaChartLine } from 'react-icons/fa'
import useScrollFade from '../hooks/useScrollFade'

const FeaturesSection = () => {
  useScrollFade('.features-section')
  return (
    <div className="features-section py-5" id="features">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2>Features</h2>
            <p className="text-muted">Explore the amazing features we offer.</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Card className="border-0">
              <Card.Body className="text-center">
                <FaRocket size={50} className="mb-4" />
                <Card.Title>Fast Performance</Card.Title>
                <Card.Text>
                  Experience blazing fast speeds with our service.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0">
              <Card.Body className="text-center">
                <FaShieldAlt size={50} className="mb-4" />
                <Card.Title>Secure</Card.Title>
                <Card.Text>
                  Your data is protected with our top-notch security.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0">
              <Card.Body className="text-center">
                <FaChartLine size={50} className="mb-4" />
                <Card.Title>Analytics</Card.Title>
                <Card.Text>
                  Gain insights with our comprehensive analytics.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FeaturesSection

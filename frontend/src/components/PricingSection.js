import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import useScrollFade from '../hooks/useScrollFade'

const PricingSection = () => {
  useScrollFade('.pricing-section')
  return (
    <div className="pricing-section py-5" id="pricing">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2>Pricing Plans</h2>
            <p className="text-muted">Choose a plan that fits your needs.</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h4 className="my-0 fw-normal">Basic</h4>
              </Card.Header>
              <Card.Body>
                <h1 className="card-title pricing-card-title">
                  $19<small className="text-muted">/mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>10 users included</li>
                  <li>2 GB of storage</li>
                  <li>Email support</li>
                  <li>Help center access</li>
                </ul>
                <Button variant="outline-primary" size="lg">
                  Get Started
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h4 className="my-0 fw-normal">Pro</h4>
              </Card.Header>
              <Card.Body>
                <h1 className="card-title pricing-card-title">
                  $49<small className="text-muted">/mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>20 users included</li>
                  <li>10 GB of storage</li>
                  <li>Priority email support</li>
                  <li>Help center access</li>
                </ul>
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h4 className="my-0 fw-normal">Enterprise</h4>
              </Card.Header>
              <Card.Body>
                <h1 className="card-title pricing-card-title">
                  $99<small className="text-muted">/mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>30 users included</li>
                  <li>15 GB of storage</li>
                  <li>Phone and email support</li>
                  <li>Help center access</li>
                </ul>
                <Button variant="primary" size="lg">
                  Contact Us
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PricingSection

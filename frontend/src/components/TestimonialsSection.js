// src/components/TestimonialsSection.js

import React from 'react'
import { Container, Row, Col, Carousel } from 'react-bootstrap'
import useScrollFade from '../hooks/useScrollFade'

const TestimonialsSection = () => {
  useScrollFade('.testimonials-section')
  return (
    <div className="testimonials-section bg-light py-5" id="testimonials">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2>What Our Clients Say</h2>
            <p className="text-muted">
              Hear from some of our satisfied clients.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Carousel>
              <Carousel.Item>
                <p className="lead">
                  "This product has transformed our business operations!"
                </p>
                <small className="text-muted">
                  - Jane Doe, CEO of ExampleCorp
                </small>
              </Carousel.Item>
              <Carousel.Item>
                <p className="lead">
                  "Exceptional quality and customer service."
                </p>
                <small className="text-muted">
                  - John Smith, Founder of StartupInc
                </small>
              </Carousel.Item>
              <Carousel.Item>
                <p className="lead">
                  "A must-have for anyone looking to improve their efficiency."
                </p>
                <small className="text-muted">
                  - Emily Johnson, Manager at BizSolutions
                </small>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TestimonialsSection

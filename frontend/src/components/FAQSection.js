import React from 'react'
import { Container, Row, Col, Accordion } from 'react-bootstrap'
import useScrollFade from '../hooks/useScrollFade'

const FAQSection = () => {
  useScrollFade('.faq-section')
  return (
    <div
      className="faq-section py-5 bg-light"
      id="faq"
      style={{ borderRadius: '15px' }}
    >
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2>Frequently Asked Questions</h2>
            <p className="text-muted">Got questions? We've got answers.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>What is your refund policy?</Accordion.Header>
                <Accordion.Body>
                  We offer a 30-day money-back guarantee on all our plans. If
                  you're not satisfied, contact us for a full refund.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>How do I upgrade my plan?</Accordion.Header>
                <Accordion.Body>
                  You can upgrade your plan anytime from your account dashboard.
                  Simply choose the new plan and complete the payment process.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  Is customer support available?
                </Accordion.Header>
                <Accordion.Body>
                  Yes, we offer 24/7 customer support via email and phone. Our
                  support team is here to help you with any questions or issues
                  you may have.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FAQSection

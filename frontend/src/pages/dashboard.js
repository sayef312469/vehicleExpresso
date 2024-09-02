// src/App.js

import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import '../styles/dashboard.css'

const salesData = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 10 },
  { name: 'Mar', value: 10 },
  { name: 'Apr', value: 10 },
  { name: 'May', value: 10 },
  { name: 'Jun', value: 15 },
  { name: 'Jul', value: 25 },
  { name: 'Aug', value: 20 },
  { name: 'Sep', value: 30 },
  { name: 'Oct', value: 50 },
  { name: 'Nov', value: 45 },
  { name: 'Dec', value: 60 },
]

const orderData = [
  { name: 'Jan', orders: 15 },
  { name: 'Feb', orders: 15 },
  { name: 'Mar', orders: 15 },
  { name: 'Apr', orders: 15 },
  { name: 'May', orders: 15 },
  { name: 'Jun', orders: 15 },
  { name: 'Jul', orders: 15 },
  { name: 'Aug', orders: 25 },
  { name: 'Sep', orders: 20 },
  { name: 'Oct', orders: 30 },
  { name: 'Nov', orders: 15 },
  { name: 'Dec', orders: 25 },
]

function Dashboard() {
  const goParking = () => {
    window.location.href = '/userparkhistory'
  }
  const goManagement = () => {
    window.location.href = '/vehiclecare/user'
  }
  const goRent = () => {
    window.location.href = '/record'
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4 earnings-card">
            <Card.Body>
              <Card.Title>EARNINGS</Card.Title>
              <h2>350,897</h2>
              <p style={{ color: '#28a745' }}>+3.48% Since last month</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 spendings-card">
            <Card.Body>
              <Card.Title>SPENDINGS</Card.Title>
              <h2>2,356</h2>
              <p style={{ color: '#dc3545' }}>-3.48% Since last week</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="mb-4"
            style={{ backgroundColor: '#ffc107', color: '#fff' }}
          >
            <Card.Body>
              <Card.Title>SALES</Card.Title>
              <h2>924</h2>
              <p style={{ color: '#dc3545' }}>-1.10% Since yesterday</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="mb-4"
            style={{ backgroundColor: '#28a745', color: '#fff' }}
          >
            <Card.Body>
              <Card.Title>PERFORMANCE</Card.Title>
              <h2>49.65%</h2>
              <p style={{ color: '#28a745' }}>+12% Since last month</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front green">
                <p class="title19">EARNINGS</p>
                <p>Hover Me</p>
              </div>
              <div class="flip-card-back green">
                <p class="title19">BACK</p>
                <p>Leave Me</p>
              </div>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front red">
                <p class="title19">SPENDINGS</p>
                <p>Hover Me</p>
              </div>
              <div class="flip-card-back red">
                <p class="title19">BACK</p>
                <p>Leave Me</p>
              </div>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front green">
                <p class="title19">EARNINGS</p>
                <p>Hover Me</p>
              </div>
              <div class="flip-card-back green">
                <p class="title19">BACK</p>
                <p>Leave Me</p>
              </div>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front red">
                <p class="title19">EARNINGS</p>
                <p>Hover Me</p>
              </div>
              <div class="flip-card-back red">
                <p class="title19">BACK</p>
                <p>Leave Me</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <div class="container99">
          <div class="palette">
            <div class="color73">
              <h4>EARNINGS</h4>
              <h2>350,897</h2>
            </div>
            <div class="color73">
              <h4>SPENDINGS</h4>
              <br />
              <h2>350,897</h2>
            </div>
            <div class="color73">
              <h4>EARNINGS</h4>
              <br />
              <h2>350,897</h2>
            </div>
            <div class="color73">
              <h4>EARNINGS</h4>
              <br />
              <h2>350,897</h2>
            </div>
            <div class="color73">
              <h4>EARNINGS</h4>
              <br />
              <h2>350,897</h2>
            </div>
          </div>
        </div>
      </Row>

      <Row>
        <Col md={8}>
          <Card
            className="mb-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              height: '400px',
            }}
          >
            <Card.Body>
              <Card.Title>Overview</Card.Title>
              <h3>Sales value</h3>
              <div className="d-flex justify-content-end">
                <Button variant="primary" size="sm" className="mx-1">
                  Month
                </Button>
                <Button variant="outline-primary" size="sm">
                  Week
                </Button>
              </div>
              <LineChart
                width={800}
                height={300}
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="mb-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              height: '400px',
            }}
          >
            <Card.Body>
              <Card.Title>Performance</Card.Title>
              <h3>Total orders</h3>
              <BarChart
                width={400}
                height={300}
                data={orderData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#ff7300" />
              </BarChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card
            className="mb-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              height: 'fit-content',
            }}
          >
            <Card.Body>
              <Card.Title>
                <h4>Parking History</h4>
              </Card.Title>
              <Button variant="link" onClick={goParking}>
                See all
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="mb-4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          >
            <Card.Body>
              <Card.Title>
                <h4>Car Management History</h4>
              </Card.Title>
              <Button variant="link" onClick={goManagement}>
                See all
              </Button>
              {/* Add additional components or tables for social traffic here */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="mb-4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          >
            <Card.Body>
              <Card.Title>
                <h4>Rent History</h4>
              </Card.Title>
              <Button variant="link" onClick={goRent}>
                See all
              </Button>
              {/* Add additional components or tables for social traffic here */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard

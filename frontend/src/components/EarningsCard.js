// src/components/EarningsCard.js

import React from 'react'
import { Card } from 'react-bootstrap'
import { FaMoneyBillWave } from 'react-icons/fa'

function EarningsCard() {
  return (
    <Card className="text-center shadow-sm">
      <Card.Body>
        <Card.Title>
          <FaMoneyBillWave /> Total Earning
        </Card.Title>
        <Card.Text className="display-4">$500.00</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default EarningsCard

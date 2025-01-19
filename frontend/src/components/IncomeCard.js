import React from 'react'
import { Card } from 'react-bootstrap'
import { FaChartLine } from 'react-icons/fa'

function IncomeCard() {
  return (
    <Card className="text-center shadow-sm">
      <Card.Body>
        <Card.Title>
          <FaChartLine /> Total Income
        </Card.Title>
        <Card.Text className="display-4">$203k</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default IncomeCard

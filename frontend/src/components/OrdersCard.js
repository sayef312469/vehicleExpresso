import React from 'react'
import { Card } from 'react-bootstrap'
import { FaClipboardList } from 'react-icons/fa'

function OrdersCard() {
  return (
    <Card className="text-center shadow-sm">
      <Card.Body>
        <Card.Title>
          <FaClipboardList /> Total Order
        </Card.Title>
        <Card.Text className="display-4">$961</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default OrdersCard

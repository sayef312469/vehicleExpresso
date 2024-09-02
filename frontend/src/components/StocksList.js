// src/components/StocksList.js

import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'

function StocksList() {
  const stocks = [
    { name: 'Bajaj Finery', price: 1839, profit: 10 },
    { name: 'TTML', price: 100, profit: -10 },
    { name: 'Reliance', price: 200, profit: 10 },
    { name: 'Stolon', price: 189, profit: -5 },
  ]

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Popular Stocks</Card.Title>
        <ListGroup variant="flush">
          {stocks.map((stock, index) => (
            <ListGroup.Item key={index}>
              <div className="d-flex justify-content-between">
                <span>{stock.name}</span>
                <span>${stock.price}</span>
              </div>
              <small
                className={`text-${stock.profit > 0 ? 'success' : 'danger'}`}
              >
                {stock.profit > 0
                  ? `${stock.profit}% Profit`
                  : `${Math.abs(stock.profit)}% Loss`}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default StocksList

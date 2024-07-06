import React from 'react'
import Card from 'react-bootstrap/Card'

const ServiceCard = ({ im, title, text }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img
        variant="top"
        src={im}
        width="100px"
        height="150px"
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ServiceCard

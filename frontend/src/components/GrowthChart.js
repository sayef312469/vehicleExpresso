// src/components/GrowthChart.js

import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Card } from 'react-bootstrap'

function GrowthChart() {
  const data = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Investment',
        data: [50, 60, 70, 90, 120, 150, 180, 200, 220, 240, 260, 300],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Profit',
        data: [20, 30, 50, 60, 80, 100, 120, 150, 170, 190, 210, 250],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Loss',
        data: [30, 20, 10, 20, 40, 50, 60, 70, 80, 90, 100, 120],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Maintenance',
        data: [10, 20, 30, 40, 60, 70, 80, 90, 100, 110, 120, 140],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Total Growth</Card.Title>
        <Bar data={data} options={options} />
      </Card.Body>
    </Card>
  )
}

export default GrowthChart

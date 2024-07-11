/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'

const SmallCardServices = ({ im, btn, link }) => {
  return (
    <Link to={link}>
      <div className="card">
        <img
          src={im}
          alt="Avatar"
        />
        <div className="container">
          <p>{btn}</p>
        </div>
      </div>
    </Link>
  )
}

export default SmallCardServices

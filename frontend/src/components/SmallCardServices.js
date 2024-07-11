/* eslint-disable react/prop-types */
import React from 'react'

const SmallCardServices = ({ im, btn }) => {
  return (
    <div className="card">
      <img
        src={im}
        alt="Avatar"
      />
      <div className="container">
        <p>{btn}</p>
      </div>
    </div>
  )
}

export default SmallCardServices

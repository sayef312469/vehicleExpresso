import React from 'react'
import s1 from '../img/s1.png'
import s2 from '../img/s2.png'
import s3 from '../img/s3.png'
import s4 from '../img/s4.png'
import s5 from '../img/s5.png'

const SmallCardServices = () => {
  return (
    <div className="heroServices">
      <div className="card">
        <img
          src={s5}
          alt="Avatar"
        />
        <div className="container">
          <p>Add Vehicle</p>
        </div>
      </div>

      <div className="card">
        <img
          src={s1}
          alt="Avatar"
        />
        <div className="container">
          <p>Vehicle Parks</p>
        </div>
      </div>

      <div className="card">
        <img
          src={s2}
          alt="Avatar"
        />
        <div className="container">
          <p>Search Parks</p>
        </div>
      </div>

      <div className="card">
        <img
          src={s3}
          alt="Avatar"
        />
        <div className="container">
          <p>Care Vehicle</p>
        </div>
      </div>

      <div className="card">
        <img
          src={s4}
          alt="Avatar"
        />
        <div className="container">
          <p>Track Activity</p>
        </div>
      </div>
    </div>
  )
}

export default SmallCardServices

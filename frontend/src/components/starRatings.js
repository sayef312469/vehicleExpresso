import React from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../styles/starRating.css'

const StarRating = () => {
  return (
    <div className="container1">
      <div className="row">
        <div className="col-md-12">
          <div className="stars">
            <form action="">
              <input
                className="star star-5"
                id="star-5"
                type="radio"
                name="star"
              />
              <label className="star star-5" htmlFor="star-5"></label>

              <input
                className="star star-4"
                id="star-4"
                type="radio"
                name="star"
              />
              <label className="star star-4" htmlFor="star-4"></label>

              <input
                className="star star-3"
                id="star-3"
                type="radio"
                name="star"
              />
              <label className="star star-3" htmlFor="star-3"></label>

              <input
                className="star star-2"
                id="star-2"
                type="radio"
                name="star"
              />
              <label className="star star-2" htmlFor="star-2"></label>

              <input
                className="star star-1"
                id="star-1"
                type="radio"
                name="star"
              />
              <label className="star star-1" htmlFor="star-1"></label>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StarRating

import React from 'react'
import { Container } from 'react-bootstrap'
import SmallCardServices from '../components/SmallCardServices'

const Home = () => {
  return (
    <div className="home">
      <Container
        fluid
        className="hero-section text-white text-center d-flex-column justify-content-center align-items-center"
      >
        <div className="rowServices">
          <p className="large rise">
            <span className="material-symbols-outlined">
              emoji_transportation
            </span>
            Vehicle Expresso
          </p>
        </div>
        <div className="rowServices">
          <SmallCardServices />
        </div>
      </Container>
    </div>
  )
}

export default Home

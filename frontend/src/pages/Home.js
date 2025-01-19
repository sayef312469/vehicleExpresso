import React from 'react'
import { Container } from 'react-bootstrap'
import SmallCardServices from '../components/SmallCardServices'
import pic3 from '../img/pic3.png'
import s1 from '../img/s1.png'
import s2 from '../img/s2.png'
import s3 from '../img/s3.png'
import s4 from '../img/s4.png'
import s5 from '../img/s5.png'
import msg from '../img/msg.png'
import shopP from '../img/shopP.png'

const Home = () => {
  const webName = 'Vehicle Expresso'
  const serviceArr = [
    { im: s1, btn: 'Vehicle Parks', link: '/addparkadmin' },
    { im: s2, btn: 'Search Parks', link: '/searchparks' },
    { im: s3, btn: 'Care Vehicle', link: '/vehiclecare/user' },
    { im: s4, btn: 'Track Activity', link: '/userparkhistory' },
    { im: s5, btn: 'Add Vehicle', link: '/addvehicle' },
    { im: pic3, btn: 'Offline Feedback', link: '/' },
    { im: msg, btn: 'Realtime Chat', link: '/vehiclecare/user'},
    { im: shopP, btn: 'Online Shop', link: '/myshop' },
  ]
  return (
    <div className="home">
      <Container
        fluid
        className="hero-section text-white text-center d-flex-column justify-content-center align-items-center"
      >
        <div className="rowServices">
          <h1 className='heroTitle'>Vehicle Expresso</h1>
        </div>
        <div className="rowServices">
          <div className="heroServices">
            {serviceArr &&
              serviceArr.map((s) => (
                <SmallCardServices
                  key={s.btn}
                  im={s.im}
                  btn={s.btn}
                  link={s.link}
                />
              ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Home

import React from 'react'
import { Container, Carousel, Card, Row, Col } from 'react-bootstrap'
import SmallCardServices from '../components/SmallCardServices'
import s1 from '../img/s1.png'
import s2 from '../img/s2.png'
import s3 from '../img/s3.png'
import s4 from '../img/s4.png'
import s5 from '../img/s5.png'
import pic1 from '../img/pic1.jpg'
import pic2 from '../img/pic2.jpg'

const Home = () => {
  const webName = 'Vehicle Expresso'
  const serviceArr = [
    { im: s1, btn: 'Vehicle Parks', link: '/addparkadmin' },
    { im: s2, btn: 'Search Parks', link: '/searchparks' },
    { im: s3, btn: 'Care Vehicle', link: '/vehiclecare/user' },
    { im: s4, btn: 'Track Activity', link: '/userparkhistory' },
    { im: s5, btn: 'Add Vehicle', link: '/addvehicle' },
  ]
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
            {webName.split('').map((c) => (
              <span key={c}>{c}</span>
            ))}
          </p>
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

      <Container className="my-5">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src={pic1} alt="First slide" />
            <Carousel.Caption>
              <h3>Photo with TRUST ACMC authority</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={pic2} alt="Second slide" />
            <Carousel.Caption>
              <h3>Interview with TRUST ACMC authority</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>

      <Container className="my-5">
        <h2 className="text-center">Services</h2>
        <Row>
          <Col md={4}>
            <Card className="card carSHover">
              <Card.Img
                variant="top"
                src="https://www.thenbs.com/-/media/uk/new-images/by-section/knowledge/knowledge-articles-hero/multi-storey-car-park.jpg"
              />
              <Card.Body>
                <Card.Title>Car Park</Card.Title>
                <Card.Text>
                  You can park your car near by your location or a certain
                  location
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card carSHover">
              <Card.Img
                variant="top"
                src="https://www.progressive.com/lifelanes/wp-content/uploads/2022/06/PN1305_HowOftenWashCar_Header-1.jpg"
              />
              <Card.Body>
                <Card.Title>Vehicle Care</Card.Title>
                <Card.Text>
                  {"Don't"} worried of your car. We are here to take care of
                  your car.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card carSHover">
              <Card.Img
                variant="top"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuClmp-4G4NiabQ1Mk1u0iOJ-uTISiIqY8cA&s"
              />
              <Card.Body>
                <Card.Title>Add Vehicle</Card.Title>
                <Card.Text>
                  You can add and track your vehicle here. Easy to handle a lot
                  of cars.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home

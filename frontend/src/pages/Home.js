import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import addVehicle from '../img/addVehicle.gif'
import car2 from '../img/car2.gif'
import carPark from '../img/carPark.gif'
import history from '../img/history.gif'
import notification from '../img/notification.gif'
import search from '../img/search.gif'
import takeCare from '../img/takeCare.gif'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import ServiceCard from '../components/ServiceCard'

const Home = () => {
  const [webName, setWebName] = useState('V')
  const fullText = 'Vehicle Expresso'

  useEffect(() => {
    let currentIndex = 0

    const interval = setInterval(() => {
      setWebName(fullText.slice(0, currentIndex + 1))
      currentIndex += 1
      currentIndex %= fullText.length
    }, 250)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }
  return (
    <div className="home">
      <div className="hero">
        <div className="heroleft">
          <span className="welMsg">Welcome to</span> <br />
          <span className="webName">{webName}</span>
          <div className="text">
            The Vehicle Expresso is a web-based platform designed to ease the
            burden on vehicle owners by simplifying parking and maintenance,
            especially in densely populated areas. It offers users a quick and
            convenient way to find and track nearby parking spots, ensuring
            vehicle safety. Additionally, it features options for booking
            vehicle repair or wash services during available slots. The system
            also introduces the concept of Long-term Care, providing extended
            vehicle service options for owners who are away from their vehicles
            for prolonged periods.
          </div>
        </div>
        <div className="heroright">
          <img
            src={car2}
            alt="Car Animation"
          />
        </div>
      </div>

      <div className="showServices">
        <div className="tle">
          <span className="material-symbols-outlined">speaker_group</span>
          Our Services
        </div>
        <div className="slider_container">
          <Slider {...settings}>
            <ServiceCard
              im={search}
              title="Search Parks"
              text="You can search by your current location or a certain location."
            />
            <ServiceCard
              im={addVehicle}
              title="Add Vehicle"
              text="Easy to add and track your vehicles."
            />
            <ServiceCard
              im={history}
              title="See History"
              text="You can see your exchange history and many more."
            />
            <ServiceCard
              im={notification}
              title="Notification"
              text="You will notify for your activity."
            />
            <ServiceCard
              im={carPark}
              title="Add Park"
              text="A park owner can add his park here and handle his park easily."
            />
            <ServiceCard
              im={takeCare}
              title="Care and Management"
              text="We are cocern about the care of your car."
            />
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default Home

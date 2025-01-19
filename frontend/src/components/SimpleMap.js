import { Icon } from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/leaflet.css'
import React, { useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const SimpleMap = ({ parks }) => {
  const mapRef = useRef(null)
  const latitude = 51.505
  const longitude = -0.09

  const customIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [20, 20],
    // iconAnchor: [1, 1],
    // popupAnchor: [-0, -76]
  })

  const locations = []

  parks.forEach((park, index) => {
    locations.push({
      id: index,
      position: [park.LATITUDE, park.LONGITUDE],
      description: park.NAME,
    })
  })

  return (
    // Make sure you set the height and width of the map container otherwise the map won't show
    <MapContainer
      center={locations[0].position}
      zoom={13}
      ref={mapRef}
      style={{ height: '400px', width: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.position}
          icon={customIcon}
        >
          <Popup>{location.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default SimpleMap

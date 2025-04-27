// src/components/Mapa.jsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Mapa({ viviendas }) {
  // Si no hay viviendas, centramos en España
  const centro = viviendas.length
    ? [
        viviendas[0].latitude || 40.4168,
        viviendas[0].longitude || -3.7038
      ]
    : [40.4168, -3.7038]

  return (
    <MapContainer
      center={centro}
      zoom={12}
      style={{ height: '100%', width: '100%' }}  // <- ¡muy importante!
      className="leaflet-container"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {viviendas.map((v, i) => (
        <Marker
          key={i}
          position={[v.latitude, v.longitude]}
        >
          <Popup>
            <strong>{v.titulo}</strong><br />
            {v.precio}<br />
            <a href={v.enlace} target="_blank" rel="noopener noreferrer">
              Ver en Idealista
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

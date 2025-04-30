// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Para que los iconos de Leaflet carguen correctamente:
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function Dashboard() {
  const navigate = useNavigate()
  const [zona, setZona] = useState('')
  const [precioMaximo, setPrecioMaximo] = useState('')
  const [viviendas, setViviendas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    navigate('/login')
  }

  const handleBuscar = async () => {
    setLoading(true)
    setError('')
    setViviendas([])

    try {
      const body = { zona, precio_maximo: parseInt(precioMaximo, 10) }
      const resp = await fetch('http://localhost:8000/buscar-viviendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await resp.json()
      if (data.error) {
        setError(data.error)
      } else {
        setViviendas(data)
      }
    } catch (err) {
      console.error(err)
      setError('Error de conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  // Si quieres centrar el mapa en la primera vivienda:
  const centroMapa = viviendas.length
    ? [viviendas[0].lat, viviendas[0].lon]
    : [40.4168, -3.7038] // fallback: Madrid

  // Generar informe IA
  const generarInforme = async (vivienda) => {
	  let resp
    try {
        resp = await fetch('http://localhost:8000/generar-informe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vivienda),
      })
      const { informe, error: errIa } = await resp.json()
      if (errIa) {
        alert('Fallo al generar el informe:\n' + errIa)
      } else {
        // por ejemplo, abrir en ventana nueva:
        const w = window.open()
        w.document.write(`<pre>${informe}</pre>`)
      }
    } catch (e) {
      console.error(e)
      alert('Error en la petición de informe IA.' + e)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Área Personal</h1>

      {/* Formulario de búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Zona o ciudad"
          className="border p-2 rounded"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio máximo"
          className="border p-2 rounded"
          value={precioMaximo}
          onChange={(e) => setPrecioMaximo(e.target.value)}
        />
        <button
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          onClick={handleBuscar}
          disabled={loading}
        >
          {loading ? 'Buscando…' : 'Buscar viviendas'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Mapa */}
      {viviendas.length > 0 && (
        <div className="h-96 rounded overflow-hidden">
          <MapContainer
            center={centroMapa}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {viviendas.map((v, i) => (
              <Marker key={i} position={[v.lat, v.lon]}>
                <Popup>
                  <h2 className="font-bold">{v.titulo}</h2>
                  <p>{v.zona}</p>
                  <p className="font-semibold">{v.precio}</p>
                  <button
                    className="mt-2 px-2 py-1 bg-blue-600 text-white rounded"
                    onClick={() => generarInforme(v)}
                  >
                    Informe IA
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Listado de viviendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {viviendas.map((v, i) => (
          <div
            key={i}
            className="border rounded-lg shadow p-4 hover:shadow-lg transition"
          >
            {v.imagen && (
              <img
                src={v.imagen}
                alt={v.titulo}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h2 className="text-xl font-bold mt-2">{v.titulo}</h2>
            <p>{v.zona}</p>
            <p className="text-green-600 font-semibold">{v.precio}</p>
            <p>Metros: {v.metros} m²</p>
            <p>Hab: {v.habitaciones}</p>
            <p>Baños: {v.banos}</p>
            <p>Terraza: {v.terraza ? 'Sí' : 'No'}</p>
            <a
              href={v.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline block mt-2"
            >
              Ver en Idealista
            </a>
            <button
              onClick={() => generarInforme(v)}
              className="mt-3 w-full bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
            >
              Informe IA
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default Dashboard

// src/pages/Dashboard.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// 🔧 Necesario para que el icono por defecto funcione con Vite:
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function Dashboard() {
  const navigate = useNavigate()
  const [zona, setZona]             = useState('')
  const [precioMaximo, setPrecioMaximo] = useState('')
  const [viviendas, setViviendas]   = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  
  console.log('🚀 viviendas array:', viviendas)

  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('loginTime')
    navigate('/login')
  }

  const handleBuscar = async () => {
    if (!zona || !precioMaximo) {
      setError('Debes indicar zona y precio máximo.')
      return
    }
    setLoading(true); setError(''); setViviendas([])
    try {
      const res = await fetch('http://localhost:8000/buscar-viviendas', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ zona, precio_maximo: +precioMaximo })
      })
      const data = await res.json()
      if (!res.ok)          setError(data.error || 'Error buscando.')
      else if (!data.length) setError('No hay viviendas.')
      else                   setViviendas(data)
    } catch {
      setError('Fallo de conexión.')
    } finally {
      setLoading(false)
    }
  }

  // Centro del mapa
  const center = viviendas.length
    ? [viviendas[0].lat, viviendas[0].lon]
    : [40.4168, -3.7038] // Madrid
	
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Área Personal</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={zona} onChange={e=>setZona(e.target.value)}
          placeholder="Zona o ciudad"
          className="col-span-2 px-4 py-2 border rounded"
        />
        <input
          value={precioMaximo} onChange={e=>setPrecioMaximo(e.target.value)}
          placeholder="Precio máximo"
          type="number"
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={handleBuscar}
          disabled={loading}
          className="col-span-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading? 'Buscando…':'Buscar'}
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}

      {/* Mapa */}
      {viviendas.length > 0 && (
        <MapContainer
          center={center}
          zoom={13}
          style={{ height:'400px', width:'100%' }}
          className="rounded-lg shadow-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {viviendas.map((v, i) => (
			  <Marker key={i} position={[v.lat, v.lon]}>
				<Popup>
				  <div className="w-64">
					{v.imagen && (
					  <img
						src={v.imagen}
						alt={v.titulo}
						className="w-full h-32 object-cover rounded mb-2"
					  />
					)}
					<h3 className="text-lg font-semibold mb-1">{v.titulo}</h3>
					<p className="text-green-600 font-bold mb-2">{v.precio}</p>
					<p className="text-sm"><strong>Metros:</strong> {v.metros} m²</p>
					<p className="text-sm"><strong>Hab:</strong> {v.habitaciones}</p>
					<p className="text-sm"><strong>Baños:</strong> {v.banos}</p>
					<p className="text-sm mb-2">
					  <strong>Terraza:</strong> {v.terraza ? 'Sí' : 'No'}
					</p>
					<a
					  href={v.enlace}
					  target="_blank"
					  rel="noopener noreferrer"
					  className="text-blue-500 underline text-sm"
					>
					  Ver en Idealista
					</a>
				  </div>
				</Popup>
			  </Marker>
			))}

        </MapContainer>
      )}

      {/* Listado */}
      <div className="space-y-4">
        {viviendas.map((v,i)=>(
          <div key={i} className="border p-4 rounded flex flex-col md:flex-row items-start">
            {/* Imagen */}
            {v.imagen && (
              <img
                src={v.imagen}
                alt={v.titulo}
                className="w-full md:w-48 h-32 object-cover rounded mr-4 mb-4 md:mb-0"
              />
            )}
            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{v.titulo}</h2>
              <p className="text-gray-600">{v.zona}</p>
              <p className="font-bold text-green-600">{v.precio}</p>
              <p>{v.metros} m² • {v.habitaciones} hab. • {v.banos} baño{v.banos>1?'s':''}</p>
              {v.terraza && <p className="text-blue-600">✅ Terraza</p>}
              <a
                href={v.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
              >
                Ver en Idealista
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

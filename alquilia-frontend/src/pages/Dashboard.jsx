// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [zona, setZona] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [viviendas, setViviendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  const handleBuscar = async () => {
    setLoading(true);
    setError('');
    setViviendas([]);

    try {
      const res = await fetch('http://localhost:8000/buscar-viviendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zona, precio_maximo: parseInt(precioMaximo) })
      });
      const data = await res.json();
      if (res.status !== 200) {
        setError(data.error || 'Error en la búsqueda');
      } else if (data.length === 0) {
        setError('No se encontraron viviendas');
      } else {
        setViviendas(data);
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Área Personal</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          value={zona}
          onChange={e => setZona(e.target.value)}
          placeholder="Zona o ciudad"
          className="col-span-2 px-4 py-2 border rounded"
        />
        <input
          type="number"
          value={precioMaximo}
          onChange={e => setPrecioMaximo(e.target.value)}
          placeholder="Precio máximo"
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={handleBuscar}
          disabled={loading}
          className="col-span-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-center mb-6">{error}</p>}

      {/* Listado */}
      {viviendas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {viviendas.map((vivi, i) => (
            <div key={i} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              {/* Imagen */}
              {vivi.imagen && (
                <img
                  src={vivi.imagen}
                  alt={vivi.titulo}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                
                <p className="text-gray-600 mb-1">{vivi.zona}</p>
                <p className="text-green-600 font-semibold mb-2">{vivi.precio}</p>
                {/* Datos extra */}
                <ul className="text-sm text-gray-700 mb-2 space-y-1">
                  <li><strong>Metros:</strong> {vivi.metros} m²</li>
                  <li><strong>Hab:</strong> {vivi.habitaciones}</li>
                  <li><strong>Baños:</strong> {vivi.banos}</li>
                  <li><strong>Terraza:</strong> {vivi.terraza ? 'Sí' : 'No'}</li>
                </ul>
                <a
                  href={vivi.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Ver en Idealista
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <div className="text-center mt-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

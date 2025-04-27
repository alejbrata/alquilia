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
      const body = { zona, precio_maximo: parseInt(precioMaximo) };

      const response = await fetch('http://localhost:8000/buscar-viviendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.error) {
        setError('No se pudo obtener viviendas. Inténtalo más tarde.');
      } else if (data.length === 0) {
        setError('No se encontraron viviendas para esta búsqueda.');
      } else {
        setViviendas(data);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Error en la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-center mb-8">
        Bienvenido al Área Personal
      </h1>

      {/* Formulario de búsqueda */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Introduce la zona o ciudad"
          className="w-full px-4 py-2 border rounded"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
        />
        <input
          type="number"
          placeholder="Introduce el precio máximo"
          className="w-full px-4 py-2 border rounded"
          value={precioMaximo}
          onChange={(e) => setPrecioMaximo(e.target.value)}
        />
        <button
          onClick={handleBuscar}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar viviendas'}
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="text-red-600 text-center mb-8">
          {error}
        </div>
      )}

      {/* Spinner mientras carga */}
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Listado de viviendas */}
      {viviendas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {viviendas.map((vivienda, index) => (
            <div key={index} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-xl font-bold">{vivienda.titulo}</h2>
              <p className="text-gray-600">{vivienda.zona}</p>
              <p className="text-green-600 font-semibold">{vivienda.precio}</p>
              <a
                href={vivienda.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Ver vivienda
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Botón de logout */}
      <div className="flex justify-center mt-10">
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

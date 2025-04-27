import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const inquilino = { nombre, apellidos, email, password };
    await fetch('http://localhost:8080/inquilinos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquilino)
    });
    alert("Usuario registrado correctamente ✅");
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registro de Usuario</h1>
      <input
        type="text"
        placeholder="Nombre"
        className="w-full mb-3 p-2 border rounded"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Apellidos"
        className="w-full mb-3 p-2 border rounded"
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full mb-3 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Registrar
      </button>
    </div>
  );
}

export default Register;

// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const resp = await fetch("http://localhost:8080/inquilinos/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const ok = await resp.json();

    if (ok) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loginTime", Date.now());
      alert("Login correcto ✅");
      // Al loguearnos vamos a /inquilinos, que es tu Dashboard
      navigate("/inquilinos", { replace: true });
    } else {
      alert("Email o contraseña incorrectos ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
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
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
        <p className="mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

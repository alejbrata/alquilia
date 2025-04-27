// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import LogoSmall from '../assets/logo-small.png'  // tu logo reducido

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-500">

      {/* Header */}
      <header className="container mx-auto flex items-center justify-between py-4 px-6 bg-white/30 backdrop-blur-md rounded-b-lg shadow-lg">
        <div className="flex items-center">
          <img src={LogoSmall} alt="AlquilIA" className="h-8 w-auto mr-2" />
          <span className="text-2xl font-bold text-white drop-shadow">AlquilIA</span>
        </div>
        <nav className="space-x-6 text-white">
          <Link to="/inquilinos" className="hover:text-yellow-300 transition">Inquilinos</Link>
          <Link to="/caseros"    className="hover:text-yellow-300 transition">Caseros</Link>
          <Link to="/ia"         className="hover:text-yellow-300 transition">IA</Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
          El futuro del alquiler,
          <br className="hidden lg:block"/>
          impulsado por <span className="text-yellow-300">IA</span>
        </h1>
        <p className="max-w-2xl text-lg text-white/90 mb-8">
          Alarmas inteligentes, análisis de barrios y scoring predictivo para que encuentres —o alquiles— con total confianza.
        </p>
        <div className="space-x-4">
          <Link
            to="/inquilinos"
            className="px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-400 transition"
          >
            Soy Inquilino
          </Link>
          <Link
            to="/caseros"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/20 transition"
          >
            Soy Casero
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-white/80 bg-black/20">
        © 2025 AlquilIA · Creada por Alejandro Bravo Talavante
      </footer>
    </div>
  )
}

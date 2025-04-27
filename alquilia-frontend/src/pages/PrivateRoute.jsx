// src/pages/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const loginTime = localStorage.getItem("loginTime");
  const sessionDur = 60 * 60 * 1000; // 1h
  const location = useLocation();

  if (isLoggedIn && loginTime && Date.now() - loginTime < sessionDur) {
    return children;
  }

  // Si no está logueado, lo mandamos a /login y guardamos la ruta de origen
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loginTime");
  return (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname }}
    />
  );
}

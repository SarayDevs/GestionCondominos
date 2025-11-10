// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.non_field_errors?.[0] || 'Credenciales inválidas');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica que el servidor esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-6">
        <div className="p-3 bg-sky-600 rounded-full">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="mt-4 text-3xl font-bold text-center text-gray-800">
          Gestor de Condominio
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Ingresa con tu usuario y contraseña
        </p>
      </div>

      {error && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none focus:border-sky-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-sky-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg text-lg transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

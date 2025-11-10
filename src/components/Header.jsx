// src/components/Header.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const username = localStorage.getItem('username') || 'Usuario';

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/pagos': 'Gestión de Pagos',
      '/gastos': 'Gestión de Gastos',
      '/apartamentos': 'Apartamentos',
      '/usuarios': 'Usuarios',
      '/chat': 'Asistente Virtual',
      '/configuracion': 'Configuración',
    };
    return titles[location.pathname] || 'Dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className={`flex justify-between items-center p-4 shadow-md border-b transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl font-bold ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {getPageTitle()}
      </h2>
      <div className="flex items-center gap-4">
        <p className={`text-sm hidden md:block ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {currentDate}
        </p>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          darkMode ? 'bg-aqua-900/30' : 'bg-aqua-100'
        }`}>
          <User className={`w-4 h-4 ${
            darkMode ? 'text-aqua-400' : 'text-aqua-600'
          }`} />
          <span className={`text-sm font-medium ${
            darkMode ? 'text-aqua-300' : 'text-aqua-700'
          }`}>
            {username}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

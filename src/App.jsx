// src/App.jsx
import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "./context/ThemeContext";

import LoginPage from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Pagos from "./pages/Pagos";
import Gastos from "./pages/Gastos";
import Apartamentos from "./pages/Apartamentos";
import Chat from "./pages/Chat";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatbaseWidget from "./components/ChatbaseWidget";

// Layout principal
function Layout({ sidebarCollapsed, setSidebarCollapsed }) {
  const { darkMode } = useTheme();
  return (
    <div className="flex h-screen">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [token, setToken] = useState(null);

  return (
    <>
      <ChatbaseWidget />
      <Routes>
      {/* Ruta landing promocional */}
      <Route path="/" element={<Landing />} />
      {/* Ruta login */}
      <Route path="/login" element={<LoginPage onLoginSuccess={setToken} />} />

      {/* Rutas internas (protegidas si hay token) */}
      <Route
        path="/"
        element={
          <Layout
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="gastos" element={<Gastos />} />
        <Route path="apartamentos" element={<Apartamentos />} />
        <Route path="chat" element={<Chat />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
    </>
  );
}
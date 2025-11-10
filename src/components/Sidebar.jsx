import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CreditCard,
  TrendingDown,
  Building2,
  Bot,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { darkMode } = useTheme();

  const menuItems = [
    { icon: <Home size={20} />, label: "Inicio", path: "/dashboard" },
    { icon: <CreditCard size={20} />, label: "Pagos", path: "/pagos" },
    { icon: <TrendingDown size={20} />, label: "Gastos", path: "/gastos" },
    { icon: <Building2 size={20} />, label: "Apartamentos", path: "/apartamentos" },
    { icon: <Bot size={20} />, label: "Chat bot", path: "/chat" },
    { icon: <Users size={20} />, label: "Co-propietarios", path: "/usuarios" },
    { icon: <Settings size={20} />, label: "Configuración", path: "/configuracion" },
  ];

  return (
    <div
      className={`bg-gradient-to-b from-aqua-600 to-aqua-800 dark:from-aqua-900 dark:to-aqua-950 text-white h-screen transition-all duration-300 flex flex-col shadow-xl ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between p-4 border-b border-aqua-500/30">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-aqua-100 bg-clip-text text-transparent">
            Condomino
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-aqua-700/50 dark:hover:bg-aqua-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-1 mt-4 space-y-1 px-2">
        {menuItems.map((item, i) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all ${
                active 
                  ? "bg-white/20 dark:bg-aqua-700/50 shadow-lg backdrop-blur-sm border border-aqua-300/30" 
                  : "hover:bg-aqua-700/30 dark:hover:bg-aqua-800/30"
              }`}
            >
              <span className={active ? "text-white" : "text-aqua-100"}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className={`font-medium ${active ? "text-white" : "text-aqua-50"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pie */}
      <div className="p-4 border-t border-aqua-500/30 text-sm text-aqua-100">
        {!collapsed && <p className="text-center">© 2025 Condomino</p>}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import clsx from "clsx";
import { DollarSign, TrendingUp, TrendingDown, Building2, Home } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DashboardCards() {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    saldo_neto: 0,
    total_ingresos: 0,
    total_egresos: 0,
    apartamentos_morosos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.DASHBOARD_STATS, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
   {
      title: "Saldo Neto en Cartera",
      value: formatCurrency(stats.saldo_neto),
      color: "text-yellow-500",
      icon: <DollarSign className="text-yellow-500 w-6 h-6" />,
      circleColor: "bg-yellow-100",
      change: "+2.5%",
    },
    {
      title: "Total Ingresos",
      value: formatCurrency(stats.total_ingresos),
      color: "text-green-500",
      icon: <TrendingUp className="text-green-500 w-6 h-6" />,
      circleColor: "bg-green-100",
      change: "+4.2%",
    },
    {
      title: "Total Egresos",
      value: formatCurrency(stats.total_egresos),
      color: "text-red-500",
      icon: <TrendingDown className="text-red-500 w-6 h-6" />,
      circleColor: "bg-red-100",
      change: "-1.8%",
    },
    {
      title: "Apartamentos Morosos",
      value: stats.apartamentos_morosos,
      color: "text-purple-500",
      icon: <Building2 className="text-purple-500 w-6 h-6" />,
      circleColor: "bg-purple-100",
      change: "+1",
    },
  ];
 return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`rounded-xl shadow-md p-5 flex items-center gap-4 border hover:shadow-lg transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}
        >
          {/* 🔵 Círculo con ícono */}
          <div
            className={clsx(
              "flex items-center justify-center w-12 h-12 rounded-full",
              darkMode 
                ? (c.circleColor.includes('yellow') ? 'bg-yellow-900/30' :
                   c.circleColor.includes('green') ? 'bg-green-900/30' :
                   c.circleColor.includes('red') ? 'bg-red-900/30' :
                   c.circleColor.includes('purple') ? 'bg-purple-900/30' : c.circleColor)
                : c.circleColor
            )}
          >
            {c.icon}
          </div>

          {/* 📄 Texto */}
          <div className="flex flex-col justify-center">
            <h3 className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{c.title}</h3>
            <p className={clsx("text-2xl font-bold", c.color)}>{c.value}</p>
            <p className={`text-xs mt-1 transition-colors duration-300 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              vs. período anterior {c.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
import { useState, useEffect } from "react";
import DashboardCards from "../components/DashboardCards";
import SalesChart from "../components/SalesChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import PaymentMethodChart from "../components/PaymentMethodChart";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
  CartesianGrid, ComposedChart
} from 'recharts';
import { API_ENDPOINTS } from '../config/api';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { darkMode } = useTheme();
  const token = localStorage.getItem("token");
  const [ingresosMensual, setIngresosMensual] = useState([]);
  const [egresosMensual, setEgresosMensual] = useState([]);
  const [pagosPorMetodo, setPagosPorMetodo] = useState([]);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Obtener ingresos mensuales
        const ingresosRes = await fetch(`${API_ENDPOINTS.PAGOS}resumen_mensual/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (ingresosRes.ok) {
          const ingresosData = await ingresosRes.json();
          setIngresosMensual(ingresosData);
        }

        // Obtener egresos mensuales
        const egresosRes = await fetch(`${API_ENDPOINTS.GASTOS}resumen_mensual/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (egresosRes.ok) {
          const egresosData = await egresosRes.json();
          setEgresosMensual(egresosData);
        }

        // Obtener pagos por método
        const metodoRes = await fetch(`${API_ENDPOINTS.PAGOS}por_metodo/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (metodoRes.ok) {
          const metodoData = await metodoRes.json();
          setPagosPorMetodo(metodoData);
        }

        // Obtener gastos por categoría
        const catRes = await fetch(`${API_ENDPOINTS.GASTOS}por_categoria/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          setGastosPorCategoria(catData.map(item => ({
            name: item.categoria,
            value: parseFloat(item.total)
          })));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const CATEGORY_COLORS = {
    'Mantenimiento': '#FF8042',
    'Servicios Básicos': '#0088FE',
    'Salarios': '#00C49F',
    'Inversión': '#FFBB28',
    'Otros': '#8884D8',
  };

  return (
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="p-6 overflow-y-auto">
          <h1 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard Principal</h1>
          
          {/* Tarjetas con estadísticas */}
          <DashboardCards />
          
          {/* Gráfico de ventas/ingresos */}
          <div className="mt-8">
            <SalesChart />
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Ingresos vs Egresos */}
            {ingresosMensual.length > 0 && egresosMensual.length > 0 && (
              <IncomeExpenseChart 
                ingresos={ingresosMensual} 
                egresos={egresosMensual} 
              />
            )}

            {/* Métodos de Pago */}
            {pagosPorMetodo.length > 0 && (
              <PaymentMethodChart data={pagosPorMetodo} />
            )}

            {/* Tendencia de Ingresos */}
            {ingresosMensual.length > 0 && (
              <MonthlyTrendChart 
                data={ingresosMensual} 
                title="Tendencia de Ingresos"
                color="#10B981"
              />
            )}

            {/* Tendencia de Egresos */}
            {egresosMensual.length > 0 && (
              <MonthlyTrendChart 
                data={egresosMensual} 
                title="Tendencia de Egresos"
                color="#EF4444"
              />
            )}

            {/* Gastos por Categoría */}
            {gastosPorCategoria.length > 0 && (
              <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Gastos por Categoría</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gastosPorCategoria}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {gastosPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Otros']} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString('es-CO')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Comparativa Mensual */}
            {ingresosMensual.length > 0 && (
              <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Comparativa Mensual</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ingresosMensual}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="total" fill="#0EA5E9" />
                      <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
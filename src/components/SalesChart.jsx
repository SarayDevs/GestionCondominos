// src/components/SalesChart.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { API_ENDPOINTS } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SalesChart() {
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
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const CATEGORY_COLORS = {
    'Mantenimiento': '#FF8042',
    'Servicios Básicos': '#0088FE',
    'Salarios': '#00C49F',
    'Inversión': '#FFBB28',
    'Otros': '#8884D8',
  };

  // Combinar datos de ingresos y egresos
  const comparativaData = ingresosMensual.map((ingreso, index) => ({
    mes: ingreso.mes,
    ingresos: ingreso.total,
    egresos: egresosMensual[index]?.total || 0,
  }));

  if (loading) {
    return (
      <div className={`p-6 rounded-xl shadow-md border mt-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cargando gráficos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Gráfico 1: Ingresos Mensuales - Line Chart */}
      <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Ingresos Mensuales (Línea)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ingresosMensual.length > 0 ? ingresosMensual : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Ingresos vs Egresos - Bar Chart */}
      <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Comparativa Ingresos vs Egresos
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativaData.length > 0 ? comparativaData : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="ingresos" fill="#10B981" name="Ingresos" radius={[4, 4, 0, 0]} />
              <Bar dataKey="egresos" fill="#EF4444" name="Egresos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 3: Métodos de Pago - Pie Chart */}
      {pagosPorMetodo.length > 0 && (
        <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Distribución por Método de Pago
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pagosPorMetodo}
                  dataKey="total"
                  nameKey="metodo_pago"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pagosPorMetodo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráfico 4: Gastos por Categoría - Pie Chart */}
      {gastosPorCategoria.length > 0 && (
        <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Gastos por Categoría
          </h3>
          <div className="h-64">
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
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráfico 5: Área de Ingresos */}
      <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Área de Ingresos Acumulados
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ingresosMensual.length > 0 ? ingresosMensual : []}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorIngresos)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 6: Egresos Mensuales - Bar Chart */}
      <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Egresos Mensuales
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={egresosMensual.length > 0 ? egresosMensual : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="total" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 7: Comparativa Composed Chart */}
      <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Análisis Comparativo Completo
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={comparativaData.length > 0 ? comparativaData : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="ingresos" fill="#10B981" name="Ingresos" />
              <Bar yAxisId="left" dataKey="egresos" fill="#EF4444" name="Egresos" />
              <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#0ea5e9" strokeWidth={2} name="Tendencia Ingresos" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
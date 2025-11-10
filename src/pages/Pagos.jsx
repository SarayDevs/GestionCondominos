import React, { useMemo, useState, useEffect } from 'react';
import { CreditCard, ArrowDown, Search, Plus, Download, Eye, FileText, Calendar, AlertCircle, List } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
  CartesianGrid, ComposedChart
} from 'recharts';
import RegistroPagoForm from '../components/RegistroPagoForm';
import { API_ENDPOINTS } from '../config/api';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// --- Componentes Reutilizables ---
const IconCard = ({ title, value, icon, bgColor, iconColor, darkMode = false }) => (
  <div className={`flex items-center justify-between p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
    <div>
      <p className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
      <p className={`mt-1 text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
    <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>{icon}</div>
  </div>
);

const SectionTitle = ({ title, actions, darkMode = false }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h1>
    {actions}
  </div>
);

// Formatear número como moneda
const formatCurrency = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num);
};

// --- Componente Principal ---
export default function Pagos() {
  const { darkMode } = useTheme();
  const token = localStorage.getItem("token");

  const [pagos, setPagos] = useState([]);
  const [apartamentoFilter, setApartamentoFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumenMensual, setResumenMensual] = useState([]);
  const [pagosPorMetodo, setPagosPorMetodo] = useState([]);
  const [pagosPorApartamento, setPagosPorApartamento] = useState([]);

  // --- Traer pagos y estadísticas ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener pagos
        const response = await fetch(API_ENDPOINTS.PAGOS, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Error al cargar pagos");
        const data = await response.json();
        setPagos(data.results || data);

        // Obtener resumen mensual
        const resumenRes = await fetch(`${API_ENDPOINTS.PAGOS}resumen_mensual/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (resumenRes.ok) {
          const resumenData = await resumenRes.json();
          setResumenMensual(resumenData);
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

        // Obtener pagos por apartamento
        const aptoRes = await fetch(`${API_ENDPOINTS.PAGOS}por_apartamento/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (aptoRes.ok) {
          const aptoData = await aptoRes.json();
          setPagosPorApartamento(aptoData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  // --- Cálculo de totales ---
  const totalPagado = pagos.filter(p => p.estado === 'Pagado').reduce((sum, p) => sum + p.monto, 0);
  const totalPendiente = pagos.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);

  // --- Filtrado por apartamento ---
  const filteredPagos = useMemo(() => {
    if (!apartamentoFilter) return pagos;
    return pagos.filter(p => p.apartamento.toString().includes(apartamentoFilter));
  }, [pagos, apartamentoFilter]);

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>

      <SectionTitle 
        title="Gestión de Pagos"
        darkMode={darkMode}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 transition font-semibold"
          >
            <Plus size={18} />
            Registrar Pago
          </button>
        }
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              X
            </button>
            <RegistroPagoForm token={token} />
          </div>
        </div>
      )}

      {/* Resumen y gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <IconCard
          title="Total Recibido"
          value={formatCurrency(totalPagado)}
          icon={<CreditCard size={24} />}
          bgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Pagos Pendientes"
          value={formatCurrency(totalPendiente)}
          icon={<ArrowDown size={24} />}
          bgColor="bg-yellow-100 dark:bg-yellow-900/30"
          iconColor="text-yellow-600 dark:text-yellow-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Total Pagos"
          value={pagos.length}
          icon={<List size={24} />}
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Promedio por Pago"
          value={formatCurrency(pagos.length > 0 ? totalPagado / pagos.filter(p => p.estado === 'Pagado').length : 0)}
          icon={<FileText size={24} />}
          bgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          darkMode={darkMode}
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico 1: Resumen Mensual - Bar Chart */}
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ingresos Mensuales</h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ingresos totales por cuotas en los últimos meses</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumenMensual.length > 0 ? resumenMensual : []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [formatCurrency(value), 'Total']}
                />
                <Bar dataKey="total" fill="#0EA5E9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Pagos por Método - Pie Chart */}
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Distribución por Método de Pago</h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Proporción de pagos según método utilizado</p>
          <div className="h-64 w-full">
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

        {/* Gráfico 3: Tendencia Mensual - Line Chart */}
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tendencia de Ingresos</h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Evolución de los ingresos a lo largo del tiempo</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resumenMensual.length > 0 ? resumenMensual : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [formatCurrency(value), 'Total']}
                />
                <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 4: Área de Ingresos */}
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Área de Ingresos Acumulados</h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visualización de acumulación de ingresos</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resumenMensual.length > 0 ? resumenMensual : []}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [formatCurrency(value), 'Total']}
                />
                <Area type="monotone" dataKey="total" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 5: Top Apartamentos - Bar Chart Horizontal */}
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Top Apartamentos por Ingresos</h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Apartamentos con mayores ingresos registrados</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pagosPorApartamento.slice(0, 5)} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="apartamento__numero" type="category" width={60} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [formatCurrency(value), 'Total']}
                />
                <Bar dataKey="total" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 6: Comparativa Mensual - Composed Chart */}
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Análisis Comparativo Mensual</h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comparación de ingresos y cantidad de pagos</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={resumenMensual.length > 0 ? resumenMensual : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                />
                <Bar yAxisId="left" dataKey="total" fill="#0EA5E9" />
                <Line yAxisId="right" type="monotone" dataKey="total" stroke="#EF4444" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de Pagos */}
      <div className={`mt-6 p-6 rounded-xl shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <List className="w-6 h-6 mr-3 text-blue-600" />
          Últimos Pagos Registrados
        </h2>

        {loading && <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cargando pagos...</p>}

        {error && (
          <div className={`flex items-center p-4 text-sm rounded-lg transition-colors duration-300 ${
            darkMode 
              ? 'text-red-300 bg-red-900/30 border border-red-800' 
              : 'text-red-700 bg-red-100'
          }`}>
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <div><span className="font-medium">Error:</span> {error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  {['Apto', 'Monto', 'Fecha', 'Método'].map(header => (
                    <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {filteredPagos.slice(0,10).map(pago => (
                  <tr key={pago.id} className={darkMode ? 'hover:bg-gray-700' : ''}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{pago.apartamento_details?.numero || pago.apartamento}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formatCurrency(pago.monto)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{pago.fecha_pago}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm capitalize transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{pago.metodo_pago}</td>
                  </tr>
                ))}
                {filteredPagos.length === 0 && <tr><td colSpan="4" className={`px-6 py-4 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No se han registrado pagos.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
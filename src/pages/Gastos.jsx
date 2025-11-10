import React, { useMemo, useState, useEffect } from 'react';
import { TrendingDown, ArrowUp, Search, Plus, Download, Eye, FileText, Calendar, X } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
  CartesianGrid, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar
} from 'recharts';
import { API_ENDPOINTS } from '../config/api';
import { formatCurrency } from '../utils/format';
import { useTheme } from '../context/ThemeContext';

const COLORS_CHART = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#8884D8', '#EF4444'];

const CATEGORY_COLORS = {
    'Mantenimiento': '#FF8042',
    'Servicios Básicos': '#0088FE',
    'Salarios': '#00C49F',
    'Inversión': '#FFBB28',
    'Otros': '#8884D8',
};


// --- Función Simulación API: GET /api/gastos/por_categoria/ ---
const getGastosPorCategoria = (gastos) => {
    const gastosPorCategoria = gastos.reduce((acc, gasto) => {
        const cat = gasto.categoria || 'Otros';
        acc[cat] = (acc[cat] || 0) + gasto.monto;
        return acc;
    }, {});

    return Object.keys(gastosPorCategoria).map(name => ({
        name,
        value: gastosPorCategoria[name],
    }));
};

// --- Componentes Reutilizables ---

const IconCard = ({ title, value, icon, bgColor, iconColor, darkMode = false }) => (
  <div className={`flex items-center justify-between p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
    darkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-100'
  }`}>
    <div>
      <p className={`text-sm font-medium ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>{title}</p>
      <p className={`mt-1 text-3xl font-bold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>{value}</p>
    </div>
    <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
      {icon}
    </div>
  </div>
);

const SectionTitle = ({ title, actions }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    {actions}
  </div>
);

// --- Componente Modal (Registrar Gasto) ---

const GastosModal = ({ isOpen, onClose, onRegister }) => {
    if (!isOpen) return null;

    const handleRegister = (e) => {
        e.preventDefault();
        const data = {
            concepto: e.target.concepto.value,
            monto: parseFloat(e.target.monto.value),
            proveedor: e.target.proveedor.value,
            estado: e.target.estado.value,
            categoria: e.target.categoria.value,
        };
        onRegister(data);
    };

    const categorias = ['Mantenimiento', 'Servicios Básicos', 'Salarios', 'Inversión', 'Otros'];

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
                    title="Cerrar"
                >
                    <X size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Registrar Nuevo Gasto</h2>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Concepto</label>
                        <input type="text" name="concepto" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Monto ($)</label>
                        <input type="number" name="monto" step="0.01" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select name="categoria" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500">
                            <option value="">Seleccione una categoría</option>
                            {categorias.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Proveedor/Destino</label>
                        <input type="text" name="proveedor" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select name="estado" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500">
                            <option value="Pagado">Pagado</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium shadow-md">
                            Guardar Gasto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Componente Principal ---

export default function Gastos() {
  const { darkMode } = useTheme();
  const token = localStorage.getItem("token");
  const [gastos, setGastos] = useState([]); 
  const [conceptoFilter, setConceptoFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [resumenMensual, setResumenMensual] = useState([]);
  const [gastosPorProveedor, setGastosPorProveedor] = useState([]);
  const [gastosPorEstado, setGastosPorEstado] = useState([]);

  // Función para recargar estadísticas sin recargar toda la página
  const reloadStats = async () => {
    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      const [catRes, resumenRes, provRes, estadoRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.GASTOS}por_categoria/`, { headers }),
        fetch(`${API_ENDPOINTS.GASTOS}resumen_mensual/`, { headers }),
        fetch(`${API_ENDPOINTS.GASTOS}por_proveedor/`, { headers }),
        fetch(`${API_ENDPOINTS.GASTOS}por_estado/`, { headers })
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setGastosPorCategoria(catData.map(item => ({
          name: item.categoria,
          value: parseFloat(item.total)
        })));
      }

      if (resumenRes.ok) {
        const resumenData = await resumenRes.json();
        setResumenMensual(resumenData);
      }

      if (provRes.ok) {
        const provData = await provRes.json();
        setGastosPorProveedor(provData);
      }

      if (estadoRes.ok) {
        const estadoData = await estadoRes.json();
        setGastosPorEstado(estadoData);
      }
    } catch (err) {
      console.error('Error al recargar estadísticas:', err);
    }
  };

  // Cargar datos del backend - Optimizado con Promise.all
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      };
      
      try {
        // Hacer todas las peticiones en paralelo
        const [gastosRes, catRes, resumenRes, provRes, estadoRes] = await Promise.all([
          fetch(API_ENDPOINTS.GASTOS, { headers }),
          fetch(`${API_ENDPOINTS.GASTOS}por_categoria/`, { headers }),
          fetch(`${API_ENDPOINTS.GASTOS}resumen_mensual/`, { headers }),
          fetch(`${API_ENDPOINTS.GASTOS}por_proveedor/`, { headers }),
          fetch(`${API_ENDPOINTS.GASTOS}por_estado/`, { headers })
        ]);

        // Procesar respuesta de gastos
        if (!gastosRes.ok) throw new Error("Error al cargar gastos");
        const gastosData = await gastosRes.json();
        setGastos(gastosData.results || gastosData);

        // Procesar gastos por categoría
        if (catRes.ok) {
          const catData = await catRes.json();
          setGastosPorCategoria(catData.map(item => ({
            name: item.categoria,
            value: parseFloat(item.total)
          })));
        }

        // Procesar resumen mensual
        if (resumenRes.ok) {
          const resumenData = await resumenRes.json();
          setResumenMensual(resumenData);
        }

        // Procesar gastos por proveedor
        if (provRes.ok) {
          const provData = await provRes.json();
          setGastosPorProveedor(provData);
        }

        // Procesar gastos por estado
        if (estadoRes.ok) {
          const estadoData = await estadoRes.json();
          setGastosPorEstado(estadoData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);

  // Lógica de Registro
  const handleRegisterExpense = async (formData) => {
    try {
      const response = await fetch(API_ENDPOINTS.GASTOS, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          fecha_gasto: new Date().toISOString().split('T')[0]
        })
      });
      if (!response.ok) throw new Error("Error al registrar gasto");
      const newGasto = await response.json();
      setGastos(prev => [newGasto, ...prev]);
      setIsModalOpen(false);
      // Recargar solo las estadísticas sin recargar toda la página
      await reloadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // Cálculo de resúmenes
  const totalGastado = gastos
    .filter(g => g.estado === 'Pagado')
    .reduce((sum, g) => sum + parseFloat(g.monto || 0), 0);

  const totalPorPagar = gastos
    .filter(g => g.estado === 'Pendiente')
    .reduce((sum, g) => sum + parseFloat(g.monto || 0), 0);

  // Calcular promedio por gasto (solo gastos pagados)
  const gastosPagados = gastos.filter(g => g.estado === 'Pagado');
  const promedioPorGasto = gastosPagados.length > 0 
    ? totalGastado / gastosPagados.length 
    : 0;

  // Obtener datos por categoría (fallback local si no hay datos del backend)
  const gastosPorCategoriaData = useMemo(() => {
    if (gastosPorCategoria.length > 0) return gastosPorCategoria;
    return getGastosPorCategoria(gastos);
  }, [gastosPorCategoria, gastos]);

  // Simulación de filtro
  const filteredGastos = useMemo(() => {
    return gastos.filter(g => g.concepto.toLowerCase().includes(conceptoFilter.toLowerCase()));
  }, [gastos, conceptoFilter]);

  // Mostrar spinner de carga
  if (loading) {
    return (
      <div className={`p-6 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full h-16 w-16 border-b-2 ${
            darkMode ? 'border-aqua-400' : 'border-aqua-600'
          }`}></div>
          <p className={`mt-4 text-lg font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Cargando datos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      <GastosModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRegister={handleRegisterExpense}
      />

      <div className={`flex justify-between items-center mb-6 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <h1 className="text-3xl font-bold">Gestión de Gastos</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition font-semibold"
        >
          <Plus size={18} />
          Registrar Gasto
        </button>
      </div>

      {error && (
        <div className={`mb-4 p-4 rounded-lg ${
          darkMode 
            ? 'bg-red-900/30 text-red-300 border border-red-800' 
            : 'bg-red-100 text-red-700'
        }`}>
          Error: {error}
        </div>
      )}

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <IconCard
          title="Total Egresos"
          value={formatCurrency(totalGastado)}
          icon={<TrendingDown size={24} />}
          bgColor="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Gastos Pendientes"
          value={formatCurrency(totalPorPagar)}
          icon={<ArrowUp size={24} />}
          bgColor="bg-yellow-100 dark:bg-yellow-900/30"
          iconColor="text-yellow-600 dark:text-yellow-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Total Gastos"
          value={gastos.length}
          icon={<FileText size={24} />}
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Promedio por Gasto"
          value={formatCurrency(promedioPorGasto)}
          icon={<Calendar size={24} />}
          bgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          darkMode={darkMode}
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico 1: Distribución por Categoría - Pie Chart */}
        {gastosPorCategoriaData.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Gasto por Categoría</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Distribución de gastos según categoría</p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={gastosPorCategoriaData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {gastosPorCategoriaData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Otros']} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
                            formatter={(value) => [formatCurrency(value), 'Monto']} 
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* Gráfico 2: Resumen Mensual - Bar Chart */}
        {resumenMensual.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Gastos Mensuales</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Evolución de gastos en los últimos meses</p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resumenMensual.length > 0 ? resumenMensual : []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [formatCurrency(value), 'Total']}
                        />
                        <Bar dataKey="total" fill="#FF8042" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* Gráfico 3: Tendencia de Gastos - Line Chart */}
        {resumenMensual.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Tendencia de Gastos</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Línea de tiempo de los gastos</p>
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
                        <Line type="monotone" dataKey="total" stroke="#EF4444" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* Gráfico 4: Gastos por Estado - Pie Chart */}
        {gastosPorEstado.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Gastos por Estado</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Distribución entre pagados y pendientes</p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={gastosPorEstado}
                            dataKey="total"
                            nameKey="estado"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {gastosPorEstado.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.estado === 'Pagado' ? '#10B981' : '#F59E0B'} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* Gráfico 5: Top Proveedores - Bar Chart Horizontal */}
        {gastosPorProveedor.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Top Proveedores</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Proveedores con mayores montos facturados</p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={gastosPorProveedor.slice(0, 5)} 
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="proveedor" type="category" width={80} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [formatCurrency(value), 'Total']}
                        />
                        <Bar dataKey="total" fill="#0088FE" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* Gráfico 6: Área de Gastos Acumulados */}
        {resumenMensual.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Área de Gastos Acumulados</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Visualización de acumulación de gastos</p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={resumenMensual.length > 0 ? resumenMensual : []}>
                        <defs>
                            <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FF8042" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [formatCurrency(value), 'Total']}
                        />
                        <Area type="monotone" dataKey="total" stroke="#FF8042" fillOpacity={1} fill="url(#colorGastos)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* Gráfico 7: Comparativa Categorías - Bar Chart */}
        {gastosPorCategoriaData.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Comparativa por Categoría</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Montos totales por categoría de gasto</p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gastosPorCategoriaData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [formatCurrency(value), 'Total']}
                        />
                        <Bar dataKey="value" fill="#8884D8" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}

        {/* Gráfico 8: Comparativa Mensual - Composed Chart */}
        {resumenMensual.length > 0 && (
        <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
            <h3 className={`text-lg font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Análisis Comparativo</h3>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Comparación de gastos y tendencia</p>
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
                        <Bar yAxisId="left" dataKey="total" fill="#FF8042" />
                        <Line yAxisId="right" type="monotone" dataKey="total" stroke="#EF4444" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
        )}
      </div>

      {/* Tabla de Gestión */}
      <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Historial de Egresos</h2>

        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full md:w-1/3">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por Concepto..."
              value={conceptoFilter}
              onChange={(e) => setConceptoFilter(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div className="w-full md:w-auto flex justify-end md:justify-start gap-3 ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
              <Calendar size={18} />
              Fecha
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
              <Download size={18} />
              Exportar
            </button>
          </div>
        </div>

        {/* Tabla de Gastos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {['Concepto', 'Monto', 'Categoría', 'Fecha Gasto', 'Proveedor', 'Estado', 'Acciones'].map(header => (
                  <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
            }`}>
              {filteredGastos.map((gasto) => (
                <tr key={gasto.id} className={`transition ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'
                }`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>{gasto.concepto}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>{formatCurrency(gasto.monto)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-700 border border-red-200`}>
                      {gasto.categoria}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{gasto.fecha_gasto}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{gasto.proveedor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      gasto.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {gasto.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-sky-600 hover:text-sky-900 mr-2" title="Ver Detalle"><Eye size={18} /></button>
                    <button className="text-red-600 hover:text-red-900" title="Ver Factura"><FileText size={18} /></button>
                  </td>
                </tr>
              ))}
              {filteredGastos.length === 0 && (
                <tr>
                  <td colSpan="7" className={`px-6 py-4 text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>No hay gastos registrados para este concepto.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

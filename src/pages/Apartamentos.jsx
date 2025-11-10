import React, { useMemo, useState, useEffect } from 'react';
import { Home, AlertTriangle, Users, Search, ChevronRight, X, DollarSign, Calendar, FileText, Plus, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { useTheme } from '../context/ThemeContext';


// --- Componentes Reutilizables ---

const IconCard = ({ title, value, icon, bgColor, iconColor, darkMode = false }) => (
  <div className={`flex items-center justify-between p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
    <div>
      <p className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
      <p className={`mt-1 text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
    <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
      {icon}
    </div>
  </div>
);

const SectionTitle = ({ title, actions, darkMode = false }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h1>
    {actions}
  </div>
);

// --- Componente Modal (Historial de Pagos) ---

const HistorialPagosModal = ({ isOpen, onClose, apartamento, token, darkMode = false }) => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && apartamento) {
            const fetchHistorial = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${API_ENDPOINTS.APARTAMENTOS}${apartamento.id}/historial_pagos/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setHistorial(data);
                    }
                } catch (err) {
                    console.error('Error fetching historial:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistorial();
        }
    }, [isOpen, apartamento, token]);

    if (!isOpen || !apartamento) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className={`p-8 rounded-xl shadow-2xl w-full max-w-2xl relative transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <button 
                    onClick={onClose} 
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-400' 
                          : 'hover:bg-gray-100 text-gray-500'
                    }`}
                    title="Cerrar"
                >
                    <X size={20} />
                </button>
                <h2 className={`text-2xl font-bold mb-6 border-b pb-2 transition-colors duration-300 ${
                    darkMode 
                      ? 'text-white border-gray-700' 
                      : 'text-gray-800 border-gray-200'
                }`}>
                    Historial de Pagos - Apartamento {apartamento.numero}
                </h2>
                
                <div className="overflow-y-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={darkMode ? 'bg-gray-700 sticky top-0' : 'bg-sky-50 sticky top-0'}>
                            <tr>
                                {['Concepto', 'Monto', 'Fecha', 'Estado'].map(header => (
                                    <th key={header} className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                                        darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y transition-colors duration-300 ${
                            darkMode 
                              ? 'bg-gray-800 divide-gray-700' 
                              : 'bg-white divide-gray-200'
                        }`}>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className={`px-4 py-3 text-center transition-colors duration-300 ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>Cargando...</td>
                                </tr>
                            ) : historial.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className={`px-4 py-3 text-center transition-colors duration-300 ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>No hay historial de pagos</td>
                                </tr>
                            ) : (
                                historial.map((pago) => (
                                    <tr key={pago.id} className={darkMode ? 'hover:bg-gray-700' : ''}>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                                            darkMode ? 'text-gray-200' : 'text-gray-900'
                                        }`}>
                                            {pago.referencia || `Pago #${pago.id}`}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold transition-colors duration-300 ${
                                            darkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            ${parseFloat(pago.monto).toLocaleString('es-CO')}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm transition-colors duration-300 ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>{pago.fecha_pago}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                pago.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 
                                                pago.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {pago.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 font-medium shadow-md">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal ---

export default function Apartamentos() {
  const { darkMode } = useTheme();
  const token = localStorage.getItem("token");
  const [apartamentos, setApartamentos] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApartamento, setSelectedApartamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    propietario: '',
    saldo: 0,
    estado: 'Al Día'
  });

  // Cargar apartamentos del backend
  useEffect(() => {
    const fetchApartamentos = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = filterType === 'delinquent' 
          ? `${API_ENDPOINTS.APARTAMENTOS}morosos/`
          : API_ENDPOINTS.APARTAMENTOS;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Error al cargar apartamentos");
        const data = await response.json();
        setApartamentos(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchApartamentos();
  }, [token, filterType]);

  // Crear nuevo apartamento
  const handleCreateApartamento = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.APARTAMENTOS, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error("Error al crear apartamento");
      const newApt = await response.json();
      setApartamentos(prev => [newApt, ...prev]);
      setIsModalOpen(false);
      setFormData({ numero: '', propietario: '', saldo: 0, estado: 'Al Día' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Cálculo de resúmenes
  const totalApartamentos = apartamentos.length;
  const morososCount = apartamentos.filter(a => a.estado === 'Moroso').length;
  const totalSaldoPendiente = apartamentos
    .filter(a => parseFloat(a.saldo) < 0)
    .reduce((sum, a) => sum + parseFloat(a.saldo), 0);

  // Lógica de filtrado local (búsqueda)
  const filteredApartamentos = useMemo(() => {
    let list = apartamentos;
    
    // Filtrar por búsqueda de número/propietario
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        list = list.filter(a => 
            a.numero.toString().includes(query) || 
            a.propietario.toLowerCase().includes(query)
        );
    }

    return list;
  }, [apartamentos, searchQuery]);

  // Manejador para abrir el historial (Simula GET /api/apartamentos/{id}/historial_pagos/)
  const handleViewHistory = (apartamento) => {
    setSelectedApartamento(apartamento);
  };

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      <HistorialPagosModal
        isOpen={!!selectedApartamento}
        onClose={() => setSelectedApartamento(null)}
        apartamento={selectedApartamento}
        token={token}
        darkMode={darkMode}
      />

      {/* Modal para agregar apartamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className={`p-8 rounded-xl shadow-2xl w-full max-w-lg relative transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X size={20} />
            </button>
            <h2 className={`text-2xl font-bold mb-6 border-b pb-2 transition-colors duration-300 ${
              darkMode 
                ? 'text-white border-gray-700' 
                : 'text-gray-800 border-gray-200'
            }`}>Agregar Apartamento</h2>
            <form onSubmit={handleCreateApartamento} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Número</label>
                <input 
                  type="number" 
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  required 
                  className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Propietario</label>
                <input 
                  type="text" 
                  value={formData.propietario}
                  onChange={(e) => setFormData({...formData, propietario: e.target.value})}
                  required 
                  className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Saldo Inicial</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.saldo}
                  onChange={(e) => setFormData({...formData, saldo: parseFloat(e.target.value) || 0})}
                  className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Estado</label>
                <select 
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="Al Día">Al Día</option>
                  <option value="Moroso">Moroso</option>
                  <option value="A Favor">A Favor</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  darkMode 
                    ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}>
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 font-medium shadow-md">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <SectionTitle 
        title="Gestión de Apartamentos"
        darkMode={darkMode}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 transition font-semibold"
          >
            <Plus size={18} />
            Añadir Apartamento
          </button>
        }
      />

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <IconCard
          title="Total de Unidades"
          value={totalApartamentos}
          icon={<Home size={24} />}
          bgColor="bg-sky-100 dark:bg-sky-900/30"
          iconColor="text-sky-600 dark:text-sky-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Apartamentos Morosos"
          value={morososCount}
          icon={<AlertTriangle size={24} />}
          bgColor="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Saldo Pendiente Total"
          // Muestra el valor en positivo para indicar deuda
          value={`$${Math.abs(totalSaldoPendiente).toLocaleString('es-CO')}`} 
          icon={<DollarSign size={24} />}
          bgColor="bg-yellow-100 dark:bg-yellow-900/30"
          iconColor="text-yellow-600 dark:text-yellow-400"
          darkMode={darkMode}
        />
      </div>

      {/* Tabla de Gestión */}
      <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Listado de Unidades</h2>

        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full md:w-1/3">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por Apartamento o Propietario"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div className="flex gap-2">
            <button 
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterType === 'all' 
                      ? 'bg-sky-600 text-white shadow-md' 
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                Todos
            </button>
            <button 
                onClick={() => setFilterType('delinquent')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterType === 'delinquent' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                Morosos
            </button>
          </div>
        </div>

        {/* Tabla de Apartamentos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {['Apartamento', 'Propietario', 'Saldo Pendiente', 'Estado', 'Acciones'].map(header => (
                  <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
              {filteredApartamentos.map((apt) => (
                <tr key={apt.id} className={`transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-sky-50'}`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold transition-colors duration-300 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>{apt.numero}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{apt.propietario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span className={parseFloat(apt.saldo) < 0 ? 'text-red-600' : parseFloat(apt.saldo) > 0 ? 'text-green-600' : 'text-gray-700'}>
                        ${parseFloat(apt.saldo).toLocaleString('es-CO')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      apt.estado === 'Al Día' ? 'bg-green-100 text-green-800' : 
                      apt.estado === 'Moroso' ? 'bg-red-100 text-red-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {apt.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                        onClick={() => handleViewHistory(apt)} // Abre el modal (Simula GET /api/apartamentos/{id}/historial_pagos/)
                        className={`flex items-center transition-colors duration-300 ${
                          darkMode 
                            ? 'text-sky-400 hover:text-sky-300' 
                            : 'text-sky-600 hover:text-sky-800'
                        }`} 
                        title="Ver Historial de Pagos"
                    >
                        Historial <ChevronRight size={16} className="ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
              {loading ? (
                <tr>
                  <td colSpan="5" className={`px-6 py-4 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cargando...</td>
                </tr>
              ) : filteredApartamentos.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`px-6 py-4 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No se encontraron apartamentos que coincidan con los filtros.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

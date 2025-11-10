import React, { useMemo, useState, useEffect } from 'react';
import { Users, Search, Plus, Home, Mail, X, AlertCircle } from 'lucide-react';
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

// --- Componente Modal (Agregar Usuario) ---

const AgregarUsuarioModal = ({ isOpen, onClose, onRegister, apartamentos, darkMode = false }) => {
    if (!isOpen) return null;

    const handleRegister = (e) => {
        e.preventDefault();
        const data = {
            nombre: e.target.nombre.value,
            apartamento: parseInt(e.target.apartamento.value),
            rol: e.target.rol.value,
            email: e.target.email.value,
        };
        onRegister(data);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className={`p-8 rounded-xl shadow-2xl w-full max-w-lg relative transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
                }`}>Registrar Co-propietario</h2>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre Completo</label>
                        <input type="text" name="nombre" required className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                        }`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Apartamento</label>
                        <select name="apartamento" required className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                        }`}>
                            <option value="">Seleccione un apartamento</option>
                            {apartamentos.map(apt => (
                                <option key={apt.id} value={apt.id}>
                                    {apt.numero} - {apt.propietario}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Correo Electrónico</label>
                        <input type="email" name="email" required className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                        }`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rol</label>
                        <select name="rol" required className={`mt-1 w-full border rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                        }`}>
                            <option value="Propietario">Propietario</option>
                            <option value="Arrendatario">Arrendatario</option>
                            <option value="Residente">Residente</option>
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                            darkMode 
                              ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        }`}>
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 font-medium shadow-md">
                            Guardar Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Componente Principal ---

export default function Usuarios() {
  const { darkMode } = useTheme();
  const token = localStorage.getItem("token");
  const [usuarios, setUsuarios] = useState([]); 
  const [apartamentos, setApartamentos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [apartamentoFilter, setApartamentoFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuarios y apartamentos del backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Cargar usuarios
        const usuariosRes = await fetch(API_ENDPOINTS.USUARIOS, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
        const usuariosData = await usuariosRes.json();
        setUsuarios(usuariosData.results || usuariosData);

        // Cargar apartamentos para el formulario
        const aptosRes = await fetch(API_ENDPOINTS.APARTAMENTOS, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (aptosRes.ok) {
          const aptosData = await aptosRes.json();
          setApartamentos(aptosData.results || aptosData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  // Lógica de Registro
  const handleRegisterUser = async (formData) => {
    try {
      const response = await fetch(API_ENDPOINTS.USUARIOS, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al registrar usuario");
      }
      const newUsuario = await response.json();
      setUsuarios(prev => [newUsuario, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.USUARIOS}${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error("Error al eliminar usuario");
      setUsuarios(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Cálculo de resúmenes
  const totalUsuarios = usuarios.length;
  const totalApartamentosConUsuarios = new Set(usuarios.map(u => u.apartamento)).size;

  // Lógica de filtrado (Simula GET /api/usuarios/ o filtrado avanzado)
  const filteredUsuarios = useMemo(() => {
    let list = usuarios;
    
    // Filtrar por número de apartamento
    if (apartamentoFilter) {
      list = list.filter(u => {
        const aptNum = u.apartamento_details?.numero || u.apartamento;
        return aptNum.toString() === apartamentoFilter;
      });
    }
    
    // Filtrar por búsqueda de nombre/email
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        list = list.filter(u => 
            u.nombre.toLowerCase().includes(query) || 
            u.email.toLowerCase().includes(query)
        );
    }

    return list;
  }, [usuarios, searchQuery, apartamentoFilter]);

  // Lista de apartamentos únicos para el filtro
  const apartamentosUnicos = useMemo(() => {
    const apts = [...new Set(usuarios.map(u => u.apartamento_details?.numero || u.apartamento))].sort((a, b) => a - b);
    return apts;
  }, [usuarios]);


  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      <AgregarUsuarioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRegister={handleRegisterUser}
        apartamentos={apartamentos}
        darkMode={darkMode}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <SectionTitle 
        title="Gestión de Co-propietarios y Residentes"
        darkMode={darkMode}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)} // Abre el Modal (Simula POST)
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 transition font-semibold"
          >
            <Plus size={18} />
            Agregar Usuario
          </button>
        }
      />

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <IconCard
          title="Total de Usuarios"
          value={totalUsuarios}
          icon={<Users size={24} />}
          bgColor="bg-sky-100 dark:bg-sky-900/30"
          iconColor="text-sky-600 dark:text-sky-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Apartamentos Cubiertos"
          value={totalApartamentosConUsuarios}
          icon={<Home size={24} />}
          bgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          darkMode={darkMode}
        />
        <IconCard
          title="Propietarios Registrados"
          value={usuarios.filter(u => u.rol === 'Propietario').length}
          icon={<Mail size={24} />}
          bgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          darkMode={darkMode}
        />
      </div>

      {/* Tabla de Gestión */}
      <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Listado de Usuarios</h2>

        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full md:w-1/3">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por Nombre o Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Filtro por Apartamento */}
          <div className="w-full md:w-1/4">
            <select
              value={apartamentoFilter}
              onChange={(e) => setApartamentoFilter(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="">Todos los Apartamentos</option>
              {apartamentosUnicos.map(apt => (
                  <option key={apt} value={apt}>{apt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {['Nombre', 'Apartamento', 'Rol', 'Email', 'Acciones'].map(header => (
                  <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan="5" className={`px-6 py-4 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cargando...</td>
                </tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`px-6 py-4 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No se encontraron usuarios que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((user) => (
                  <tr key={user.id} className={`transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-sky-50'}`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{user.nombre}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold transition-colors duration-300 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>
                      {user.apartamento_details?.numero || user.apartamento}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.rol === 'Propietario' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' : 
                      user.rol === 'Arrendatario' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className={`transition-colors duration-300 ${
                          darkMode 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-red-600 hover:text-red-900'
                        }`} 
                        title="Eliminar Usuario"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

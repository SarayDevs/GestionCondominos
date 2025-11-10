// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login/`,
  APARTAMENTOS: `${API_BASE_URL}/api/apartamentos/`,
  PAGOS: `${API_BASE_URL}/api/pagos/`,
  GASTOS: `${API_BASE_URL}/api/gastos/`,
  USUARIOS: `${API_BASE_URL}/api/usuarios/`,
  DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard/stats/`,
};



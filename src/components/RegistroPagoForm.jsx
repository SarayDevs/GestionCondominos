import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

// --- NUEVO COMPONENTE: FORMULARIO DE REGISTRO DE PAGO ---
// Lo exportamos por defecto (export default) para que App.jsx pueda importarlo
export default function RegistroPagoForm({ token }) {
  const [apartamentos, setApartamentos] = useState([]);
  const [formData, setFormData] = useState({
    apartamento: '',
    monto: '',
    fecha_pago: new Date().toISOString().split('T')[0], // Fecha de hoy
    metodo_pago: 'transferencia',
    referencia: ''
  });
  const [loading, setLoading] = useState(true); // Inicia cargando apartamentos
  const [submitLoading, setSubmitLoading] = useState(false); // Para el envío
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Cargar apartamentos para el dropdown
  useEffect(() => {
    const fetchApartamentos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINTS.APARTAMENTOS, {
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('No se pudieron cargar los apartamentos. (¿API está encendida?)');
        }
        const data = await response.json();
        setApartamentos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApartamentos();
  }, [token]);

  // 2. Manejador para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    // Validar que el monto no sea negativo
    if (parseFloat(formData.monto) <= 0 || formData.monto === '') {
        setError('El monto debe ser un valor positivo.');
        setSubmitLoading(false);
        return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.PAGOS, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json();
        // Formatear errores de la API
        let errorMsg = 'Error al registrar el pago.';
        if (errData.apartamento) errorMsg = `Apartamento: ${errData.apartamento[0]}`;
        else if (errData.monto) errorMsg = `Monto: ${errData.monto[0]}`;
        else if (errData.fecha_pago) errorMsg = `Fecha: ${errData.fecha_pago[0]}`;
        else if (errData.detail) errorMsg = errData.detail;
        else if (Array.isArray(errData)) errorMsg = errData[0];
        else if (typeof errData === 'object') errorMsg = Object.values(errData)[0][0] || 'Error desconocido.';
        
        throw new Error(errorMsg);
      }

      const newData = await response.json();
      
      // Intentamos obtener el número del apartamento del estado local para un mensaje más amigable
      const aptoPagado = apartamentos.find(apt => apt.id === parseInt(formData.apartamento));
      const aptoNumero = aptoPagado ? aptoPagado.numero : `ID ${newData.apartamento}`;

      setSuccess(`¡Pago #${newData.id} para el apto ${aptoNumero} registrado con éxito!`);
      
      // Resetear formulario
      setFormData({
        apartamento: '',
        monto: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: 'transferencia',
        referencia: ''
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper para inputs
  const commonInputClass = "w-full px-4 py-3 mt-1 text-gray-900 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:opacity-50";

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Registrar Nuevo Pago</h2>

      {/* Mensajes de Estado Globales del Formulario */}
      {error && !submitLoading && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <div><span className="font-medium">Error:</span> {error}</div>
        </div>
      )}

      {success && !submitLoading && (
        <div className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
          <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <div><span className="font-medium">Éxito:</span> {success}</div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div className="space-y-6">
            {/* Apartamento Dropdown */}
            <div>
              <label htmlFor="apartamento" className="block text-sm font-medium text-gray-700">Apartamento</label>
              <select
                id="apartamento"
                name="apartamento"
                value={formData.apartamento}
                onChange={handleChange}
                required
                disabled={loading}
                className={commonInputClass}
              >
                <option value="">{loading ? 'Cargando apartamentos...' : 'Seleccione un apartamento...'}</option>
                {apartamentos.map(apt => (
                  <option key={apt.id} value={apt.id}>
                    {apt.numero} (Saldo: {apt.saldo})
                  </option>
                ))}
              </select>
            </div>

            {/* Monto */}
            <div>
              <label htmlFor="monto" className="block text-sm font-medium text-gray-700">Monto (COP)</label>
              <input
                id="monto"
                name="monto"
                type="number"
                step="0.01"
                placeholder="250000"
                value={formData.monto}
                onChange={handleChange}
                required
                className={commonInputClass}
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-6">
            {/* Fecha de Pago */}
            <div>
              <label htmlFor="fecha_pago" className="block text-sm font-medium text-gray-700">Fecha de Pago</label>
              <input
                id="fecha_pago"
                name="fecha_pago"
                type="date"
                value={formData.fecha_pago}
                onChange={handleChange}
                required
                className={commonInputClass}
              />
            </div>
            
            {/* Método de Pago */}
            <div>
              <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                id="metodo_pago"
                name="metodo_pago"
                value={formData.metodo_pago}
                onChange={handleChange}
                required
                className={commonInputClass}
              >
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
                <option value="pse">PSE</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Referencia (Ancho completo) */}
        <div className="pt-2">
          <label htmlFor="referencia" className="block text-sm font-medium text-gray-700">Referencia o Comentario</label>
          <input
            id="referencia"
            name="referencia"
            type="text"
            placeholder="Ej: Pago admin marzo"
            value={formData.referencia}
            onChange={handleChange}
            className={commonInputClass}
          />
        </div>

        {/* Botón */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitLoading || loading} // Desactivado si carga aptos o si envía
            className={`w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${
              (submitLoading || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitLoading ? 'Registrando Pago...' : 'Registrar Pago'}
          </button>
        </div>
      </form>
    </div>
  );
}


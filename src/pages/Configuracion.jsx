import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Sun, Bell, Users, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Componente de Interruptor de Configuración (Toggle Switch)
const SettingToggle = ({ title, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between py-4 border-b dark:border-gray-700 last:border-b-0">
        <div className="flex-1 pr-4">
            <p className="text-lg font-medium text-gray-900 dark:text-white">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={isEnabled} onChange={onToggle} />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-aqua-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aqua-500"></div>
        </label>
    </div>
);

// Componente de Sección de Configuración
const ConfigSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
            <Icon size={24} className="text-aqua-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export default function Configuracion() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    condominiumName: "Residencial Horizonte",
    emailNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
  });

  const [saveMessage, setSaveMessage] = useState(null);

  const handleSettingChange = (key, value) => {
    if (key === 'darkMode') {
      setDarkMode(value);
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      // Guardar en localStorage (puedes cambiar esto para guardar en el backend)
      localStorage.setItem('condominio_settings', JSON.stringify(settings));
      
      // Si tienes un endpoint de configuración en el backend, descomenta esto:
      /*
      const response = await fetch(`${API_ENDPOINTS.CONFIGURACION}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error("Error al guardar configuración");
      */
      
      setSaveMessage("Configuración guardada exitosamente.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage("Error al guardar: " + err.message);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Cargar configuración guardada al montar
  useEffect(() => {
    const savedSettings = localStorage.getItem('condominio_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          condominiumName: parsed.condominiumName || prev.condominiumName,
          emailNotifications: parsed.emailNotifications !== undefined ? parsed.emailNotifications : prev.emailNotifications,
          pushNotifications: parsed.pushNotifications !== undefined ? parsed.pushNotifications : prev.pushNotifications,
          maintenanceMode: parsed.maintenanceMode !== undefined ? parsed.maintenanceMode : prev.maintenanceMode,
        }));
        if (parsed.darkMode !== undefined) {
          setDarkMode(parsed.darkMode);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    }
  }, [setDarkMode]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">

      {/* Título y Descripción */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Settings size={30} className="mr-3 text-aqua-500" />
            Configuración del Sistema
        </h1>
        {saveMessage && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-lg font-medium shadow-md transition duration-300">
                {saveMessage}
            </div>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Administra las opciones generales, la apariencia y las preferencias de notificación del sistema de gestión.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sección 1: General del Sistema */}
        <ConfigSection title="Sistema y Datos Generales" icon={Settings}>
            <div>
                <label className="block text-lg font-medium text-gray-900 dark:text-white mb-1">Nombre de la Copropiedad</label>
                <input
                    type="text"
                    value={settings.condominiumName}
                    onChange={(e) => handleSettingChange('condominiumName', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-3 focus:ring-aqua-500 focus:border-aqua-500"
                    placeholder="Ej. Condominio Altavista"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Este nombre se usa en todos los reportes y comunicaciones.</p>
            </div>

            <SettingToggle
                title="Modo Mantenimiento"
                description="Deshabilita el acceso de los usuarios externos temporalmente."
                isEnabled={settings.maintenanceMode}
                onToggle={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
            />
        </ConfigSection>

        {/* Sección 2: Apariencia */}
        <ConfigSection title="Preferencias de Apariencia" icon={Sun}>
            <SettingToggle
                title="Modo Oscuro"
                description="Aplica un tema oscuro a toda la interfaz para reducir la fatiga visual."
                isEnabled={darkMode}
                onToggle={() => handleSettingChange('darkMode', !darkMode)}
            />
            <SettingToggle
                title="Mostrar animaciones"
                description="Desactiva las transiciones y animaciones complejas de la interfaz."
                isEnabled={true} // Simulando otra configuración por defecto
                onToggle={() => {}}
            />
        </ConfigSection>

        {/* Sección 3: Notificaciones */}
        <ConfigSection title="Notificaciones" icon={Bell}>
            <SettingToggle
                title="Notificaciones por Correo Electrónico"
                description="Recibe alertas importantes del sistema en tu email registrado."
                isEnabled={settings.emailNotifications}
                onToggle={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
            />
            <SettingToggle
                title="Notificaciones Push (Móviles)"
                description="Envía notificaciones instantáneas para pagos y comunicados urgentes."
                isEnabled={settings.pushNotifications}
                onToggle={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
            />
        </ConfigSection>

        {/* Sección 4: Permisos (Ejemplo) */}
        <ConfigSection title="Gestión de Permisos" icon={Users}>
            <p className="text-gray-500 dark:text-gray-400">
                Esta sección permite configurar los roles y permisos de acceso para administradores y co-propietarios.
            </p>
            <button 
              onClick={() => navigate('/usuarios')}
              className="px-4 py-2 text-aqua-600 dark:text-aqua-400 border border-aqua-600 dark:border-aqua-400 rounded-lg hover:bg-aqua-50 dark:hover:bg-aqua-900/20 transition font-medium"
            >
                Ir a Roles y Permisos
            </button>
        </ConfigSection>
      </div>

      {/* Botón de Guardar Global */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-aqua-500 hover:bg-aqua-600 text-white rounded-lg shadow-xl transition font-bold text-lg"
        >
          <Save size={20} />
          Guardar Cambios
        </button>
      </div>

    </div>
  );
}

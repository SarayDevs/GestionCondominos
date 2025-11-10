import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function IncomeExpenseChart({ ingresos, egresos }) {
  const { darkMode } = useTheme();
  // Combinar datos de ingresos y egresos por mes
  const data = ingresos.map((ingreso, index) => ({
    mes: ingreso.mes,
    ingresos: ingreso.total,
    egresos: egresos[index]?.total || 0,
  }));

  return (
    <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ingresos vs Egresos</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar dataKey="ingresos" fill="#10B981" name="Ingresos" />
            <Bar dataKey="egresos" fill="#EF4444" name="Egresos" />
            <Line type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="egresos" stroke="#EF4444" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



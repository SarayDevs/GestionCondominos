import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function MonthlyTrendChart({ data, title = "Tendencia Mensual", color = "#0EA5E9" }) {
  const { darkMode } = useTheme();
  return (
    <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color${title.replace(/\s/g, '')})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



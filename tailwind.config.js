/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'aqua': {
                    50: '#e6f7f7',
                    100: '#b3e8e8',
                    200: '#80d9d9',
                    300: '#4dcaca',
                    400: '#1abbbb',
                    500: '#00a3a3', // Agua marina principal
                    600: '#008282',
                    700: '#006161',
                    800: '#004040',
                    900: '#001f1f',
                },
                'neon': {
                    'cyan': '#00ffff',
                    'pink': '#ff00ff',
                    'green': '#39ff14',
                    'blue': '#00d9ff',
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'breathe': 'breathe 4s ease-in-out infinite',
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            },
        },
    },
    plugins: [],
};
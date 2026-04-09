/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          bg: '#0f172a', // Slate-900
          card: '#1e293b', // Slate-800
          accent: '#6366f1', // Indigo-500
          hover: '#818cf8', // Indigo-400
          text: '#f8fafc', // Slate-50
          muted: '#94a3b8', // Slate-400
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}

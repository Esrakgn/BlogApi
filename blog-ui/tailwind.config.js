/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1D1A',
        card: '#262A26',
        cream: '#F5EEDF',
        orange: '#D35400',
        amber: '#F2A51A',
        violet: '#5D3B8C',
        mint: '#6EBB8B',
      },
      fontFamily: {
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        blob: '32px',
      },
      boxShadow: {
        flat: '8px 8px 0 rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

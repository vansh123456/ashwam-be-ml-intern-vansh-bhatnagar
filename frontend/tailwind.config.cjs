/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        piiEmail: '#3b82f6', // blue
        piiPhone: '#22c55e', // green
        piiName: '#a855f7', // purple
        piiAddress: '#f97316', // orange
        piiDob: '#14b8a6', // teal
        piiProvider: '#ec4899', // pink
        piiAppt: '#ef4444', // red
        piiInsurance: '#92400e', // brown
        piiGov: '#6b7280', // grey
      },
    },
  },
  plugins: [],
};



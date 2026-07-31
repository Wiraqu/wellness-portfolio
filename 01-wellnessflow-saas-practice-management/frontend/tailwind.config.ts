import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
        secondary: { 50: '#f8fafc', 100: '#f1f5f9', 500: '#64748b', 600: '#475569', 700: '#334155' },
        wellness: { light: '#e0f2f1', DEFAULT: '#26a69a', dark: '#00695c' }
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;

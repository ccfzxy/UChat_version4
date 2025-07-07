/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e3f2fd',
          500: '#0099cc',
          600: '#0077aa',
          700: '#003366',
        },
        secondary: {
          50: '#fff8e1',
          500: '#ffc107',
          600: '#f57c00',
        },
        success: {
          50: '#e8f5e9',
          500: '#4caf50',
          600: '#388e3c',
        },
        warning: {
          50: '#fff3e0',
          500: '#ff9800',
          600: '#f57c00',
        },
        error: {
          50: '#ffebee',
          500: '#f44336',
          600: '#e53935',
        },
      },
      fontFamily: {
        sans: ['Microsoft YaHei', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(45deg, #ff6b6b, #ffa726)',
        'gradient-success': 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'float': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'hover': '0 15px 40px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
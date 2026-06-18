/** @type {import('tailwindcss').Config} */
export default {
  // Scan all JSX/JS files inside src/
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  // Allow manual dark mode toggle via class strategy
  darkMode: 'class',

  theme: {
    extend: {
      // Mirror CSS custom properties into Tailwind utility classes
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark:    '#1d4ed8',
          light:   '#3b82f6',
        },
        accent:  '#f59e0b',
        danger:  '#ef4444',
        success: '#22c55e',
        surface: {
          DEFAULT: '#1e293b',
          elevated:'#334155',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },

      boxShadow: {
        'sm-dark': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'md-dark': '0 4px 6px -1px rgb(0 0 0 / 0.4)',
        'lg-dark': '0 10px 15px -3px rgb(0 0 0 / 0.4)',
      },

      transitionDuration: {
        fast:   '150',
        normal: '250',
        slow:   '400',
      },

      animation: {
        'fade-in':     'fadeIn 0.3s ease',
        'slide-up':    'slideUp 0.3s ease',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },

  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fbf1f2',
          100: '#f6dee1',
          200: '#edbec4',
          300: '#de8f98',
          400: '#c85f6c',
          500: '#a93648',
          600: '#6b1220',
          700: '#560f1a',
          800: '#430c14',
          900: '#33090f',
          950: '#1d0509',
          DEFAULT: '#6b1220',
        },
        secondary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          DEFAULT: '#10b981',
        },
        neutral: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.font-display': { 'font-family': 'var(--font-jakarta), var(--font-inter), system-ui, sans-serif' },
      });
    },
  ],
};

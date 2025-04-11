/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#900000',
          dark: '#700000',
          light: '#ad0000',
        },
        secondary: {
          DEFAULT: '#4B5563',
          dark: '#1F2937',
          light: '#F3F4F6',
        },
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
      },
      fontFamily: {
        vazirmatn: ['var(--font-vazirmatn)', 'sans-serif'],
        sans: ['Inter', 'var(--font-vazirmatn)', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
        'input': '6px',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
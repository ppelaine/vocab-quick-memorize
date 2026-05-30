/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Original palette mapped to shadcn convention
        // --accent coral, --accent2 purple, --gold, --green, --red, --blue
        coral: {
          DEFAULT: '#ff7b5c',
          light: '#fff0eb',
          dark: '#f06d4e',
          50: '#fff0eb',
          100: '#ffe5db',
          200: '#ffc8b0',
          300: '#ff9e80',
          400: '#ff7b5c',
          500: '#f06d4e',
          600: '#e5594d',
        },
        purple: {
          DEFAULT: '#8b6fc0',
          light: '#f4f0fa',
          dark: '#7d5fb5',
        },
        gold: {
          DEFAULT: '#f4b843',
          light: '#fef8ed',
          dark: '#d49b20',
        },
        green: {
          DEFAULT: '#58b368',
          light: '#e7f5e9',
        },
        red: {
          DEFAULT: '#f2675a',
          light: '#fef0ee',
        },
        blue: {
          DEFAULT: '#5b9bd5',
          light: '#eef5fb',
        },
        app: {
          bg: '#faf8f3',
          card: '#ffffff',
          text: '#2d2a28',
          muted: '#9a948c',
          border: '#f0ebe0',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      fontFamily: {
        sans: ['Nunito', '"Microsoft YaHei"', '"PingFang SC"', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(-50%) translateY(-24px) scale(0.9)' },
          to: { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
        },
        'toast-out': {
          from: { opacity: '1' },
          to: { opacity: '0', transform: 'translateX(-50%) translateY(-12px)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.9) translateY(16px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'score-reveal': {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        'correct-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
        'wrong-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '50%': { transform: 'translateX(6px)' },
          '75%': { transform: 'translateX(-4px)' },
        },
        confetti: {
          '0%': { opacity: '1', transform: 'translateY(0) rotate(0deg) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(100vh) rotate(720deg) scale(0.3)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        float: 'float 3s ease-in-out infinite',
        'toast-in': 'toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'toast-out': 'toast-out 0.3s ease forwards',
        'modal-in': 'modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'score-reveal': 'score-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'correct-pulse': 'correct-pulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'wrong-shake': 'wrong-shake 0.5s ease',
        confetti: 'confetti 2s 0s ease-in forwards',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

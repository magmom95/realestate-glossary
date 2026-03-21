import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0d0d0d',
          2: '#141414',
          3: '#1c1c1c',
          4: '#232323',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          hover: 'rgba(255,255,255,0.15)',
        },
        text: {
          primary: '#f0ece4',
          secondary: '#8a8276',
          muted: '#4a4640',
        },
        accent: {
          DEFAULT: '#e8c97d',
          hover: '#f0d896',
          dim: 'rgba(232,201,125,0.12)',
        },
        danger: {
          DEFAULT: '#e05252',
          dim: 'rgba(224,82,82,0.1)',
        },
        success: {
          DEFAULT: '#52b788',
          dim: 'rgba(82,183,136,0.1)',
        },
        info: {
          DEFAULT: '#5b9bd5',
          dim: 'rgba(91,155,213,0.1)',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '20px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        lg: '0 8px 48px rgba(0,0,0,0.6)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;

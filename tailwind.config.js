import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateY(10%)',
            opacity: '0.5'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'bounce-light': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        ultraSoftGlow: {
          '0%, 100%': {
            boxShadow: '0 0 80px 40px rgba(75, 0, 130, 0.08)',
          },
          '10%': {
            boxShadow: '0 0 80px 40px rgba(106, 90, 205, 0.08)',
          },
          '20%': {
            boxShadow: '0 0 80px 40px rgba(123, 104, 238, 0.08)',
          },
          '30%': {
            boxShadow: '0 0 80px 40px rgba(138, 43, 226, 0.08)',
          },
          '40%': {
            boxShadow: '0 0 80px 40px rgba(147, 112, 219, 0.08)',
          },
          '50%': {
            boxShadow: '0 0 80px 40px rgba(100, 149, 237, 0.08)',
          },
          '60%': {
            boxShadow: '0 0 80px 40px rgba(65, 105, 225, 0.08)',
          },
          '70%': {
            boxShadow: '0 0 80px 40px rgba(30, 144, 255, 0.08)',
          },
          '80%': {
            boxShadow: '0 0 80px 40px rgba(106, 90, 205, 0.08)',
          },
          '90%': {
            boxShadow: '0 0 80px 40px rgba(75, 0, 130, 0.08)',
          },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.6s ease-in-out',
        'slide-up-slow': 'slide-up 0.8s ease-in-out',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'bounce-light': 'bounce-light 1s infinite',
        'ultra-soft-glow': 'ultraSoftGlow 5s linear infinite',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

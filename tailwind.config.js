/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        trowelSlide: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }
        },
        trowelBounceSlide: {
          '0%':   { transform: 'translate(0px, -60px) rotate(-30deg)' },
          '15%':  { transform: 'translate(0px, 0px) rotate(-30deg)' },
          '20%':  { transform: 'translate(-8px, 8px) rotate(-30deg)' },
          '25%':  { transform: 'translate(0px, 0px) rotate(-30deg)' },
          '30%':  { transform: 'translate(-6px, 6px) rotate(-30deg)' },
          '35%':  { transform: 'translate(0px, 0px) rotate(-30deg)' },
          '40%':  { transform: 'translate(-4px, 4px) rotate(-30deg)' },
          '45%':  { transform: 'translate(0px, 0px) rotate(-30deg)' },
          '85%':  { transform: 'translate(0px, 0px) rotate(-30deg)' },
          '100%': { transform: 'translate(80px, 0px) rotate(-30deg)' }
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'fadeInUp': 'fadeInUp 1.5s ease-out',
        'slideIn': 'slideIn 0.8s ease-out',
        'fadeIn': 'fadeIn 2s ease-out',
        'trowelSlide': 'trowelSlide 1.5s cubic-bezier(0.4,0,0.2,1) 1',
        'trowelBounceSlide': 'trowelBounceSlide 2.2s cubic-bezier(0.4,0,0.2,1) 1'
      }
    },
  },
  plugins: [],
};

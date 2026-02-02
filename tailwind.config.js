export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'SF Pro Display', 'HarmonyOS Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Monaco', 'monospace'],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'blob-morph': 'blobMorph 20s infinite alternate',
        'gradient-shift': 'gradientShift 6s ease-in-out infinite',
        'aurora-pulse': 'auroraPulse 15s ease-in-out infinite alternate',
        'grid-shift': 'gridShift 30s linear infinite',
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
        blobMorph: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
            'border-radius': '30% 70% 70% 30% / 30% 30% 70% 70%',
          },
          '25%': {
            transform: 'translate(20px, -20px) scale(1.1)',
            'border-radius': '70% 30% 50% 50% / 60% 40% 60% 40%',
          },
          '50%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
            'border-radius': '50% 50% 30% 70% / 70% 30% 70% 30%',
          },
          '75%': {
            transform: 'translate(10px, 10px) scale(1.05)',
            'border-radius': '30% 70% 30% 70% / 50% 50% 50% 50%',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
            'border-radius': '70% 30% 70% 30% / 40% 60% 40% 60%',
          },
        },
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        auroraPulse: {
          '0%': { opacity: '0.7' },
          '100%': { opacity: '1' },
        },
        gridShift: {
          '0%': { 'background-position': '0 0, 0 0, 0 0, 0 0, 0 0' },
          '100%': { 'background-position': '450px 450px, 480px 480px, 300px 300px, 140px 0, 0 140px' },
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#4F46E5',  // Indigo-600
        'primary-purple': '#7C3AED', // Violet-600
        'secondary-blue': '#60A5FA', // Blue-400
        'secondary-purple': '#A78BFA', // Violet-400
        'accent': '#3B82F6', // Blue-500
        'success': '#22C55E', // Green-500
        'warning': '#EAB308', // Yellow-500
        'error': '#EF4444', // Red-500
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #4F46E5, #7C3AED)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'loadingBar': 'loadingBar 1.5s infinite ease-in-out',
        'gradient-x': 'gradient-x 3s ease infinite',
        'border-flow': 'border-flow 2s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'border-flow': {
          '0%, 100%': { 'border-color': 'rgba(37, 99, 235, 1)' },
          '50%': { 'border-color': 'rgba(147, 51, 234, 1)' }
        }
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(79, 70, 229, 0.5)',
        'chat-focus': '0 0 0 2px rgba(79, 70, 229, 0.3), 0 0 0 4px rgba(124, 58, 237, 0.2)'
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Changed from 'media' to 'class' to support manual theme switching
}

export default config
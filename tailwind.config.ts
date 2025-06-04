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
      },      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'slideUp': 'slideUp 0.5s ease-out',
        'loadingBar': 'loadingBar 1.5s infinite ease-in-out',
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-xy': 'gradient-xy 6s ease infinite',
        'border-flow': 'border-flow 2s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        // Enhanced chat start animations
        'chat-welcome-fade': 'chatWelcomeFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'chat-input-rise': 'chatInputRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'chat-input-morph': 'chatInputMorph 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'suggestions-cascade': 'suggestionsCascade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'icon-bounce': 'iconBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'typing-shimmer': 'typingShimmer 1.5s ease-in-out infinite',
      },      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
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
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
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
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },        // Enhanced professional chat start animations
        chatWelcomeFade: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) scale(0.95)',
            filter: 'blur(5px)'
          },
          '50%': { 
            opacity: '0.7', 
            transform: 'translateY(10px) scale(0.98)',
            filter: 'blur(2px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0px)'
          },
        },
        chatInputRise: {
          '0%': { 
            transform: 'translateY(60px) scale(0.9)', 
            opacity: '0',
            boxShadow: '0 0 0 rgba(79, 70, 229, 0)'
          },
          '60%': { 
            transform: 'translateY(-5px) scale(1.02)', 
            opacity: '0.8',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)'
          },
          '100%': { 
            transform: 'translateY(0) scale(1)', 
            opacity: '1',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)'
          },
        },
        chatInputMorph: {
          '0%': { 
            borderRadius: '50px', 
            opacity: '0',
            transform: 'scale(0.8)',
            background: 'linear-gradient(45deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))'
          },
          '50%': { 
            borderRadius: '20px', 
            opacity: '0.7',
            transform: 'scale(1.05)',
            background: 'linear-gradient(45deg, rgba(79, 70, 229, 0.05), rgba(124, 58, 237, 0.05))'
          },
          '100%': { 
            borderRadius: '8px', 
            opacity: '1',
            transform: 'scale(1)',
            background: 'transparent'
          },
        },
        suggestionsCascade: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px) translateX(-10px) scale(0.9)',
            filter: 'blur(3px)'
          },
          '60%': { 
            opacity: '0.8', 
            transform: 'translateY(-2px) translateX(0) scale(1.02)',
            filter: 'blur(1px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) translateX(0) scale(1)',
            filter: 'blur(0px)'
          },
        },
        iconBounce: {
          '0%': { 
            transform: 'translateY(0) rotate(0deg) scale(1)', 
            opacity: '1' 
          },
          '30%': { 
            transform: 'translateY(-12px) rotate(5deg) scale(1.1)', 
            opacity: '0.8' 
          },
          '60%': { 
            transform: 'translateY(-5px) rotate(-2deg) scale(1.05)', 
            opacity: '0.9' 
          },
          '100%': { 
            transform: 'translateY(0) rotate(0deg) scale(1)', 
            opacity: '1' 
          },
        },
        typingShimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
            opacity: '0.6'
          },
          '50%': { 
            backgroundPosition: '0% 0',
            opacity: '1'
          },
          '100%': { 
            backgroundPosition: '200% 0',
            opacity: '0.6'
          },
        },
      },boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(79, 70, 229, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.4)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.4)',
        'chat-focus': '0 0 0 2px rgba(79, 70, 229, 0.3), 0 0 0 4px rgba(124, 58, 237, 0.2)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover-dark': '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Changed from 'media' to 'class' to support manual theme switching
}

export default config
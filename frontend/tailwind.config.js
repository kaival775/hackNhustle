/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#1acbbc",
        "primary-dark": "#15a397",
        "accent": "#FB7185",
        "neon-teal": "#14b8a6",
        "background-light": "#F8FAFC",
        "background-dark": "#112120",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B",
        "coral": "#fb7185",
      },
      fontFamily: {
        "display": ["Lexend", "Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
        "full": "9999px"
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(26, 203, 188, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        scan: {
          '0%, 100%': { top: '5%', opacity: '0.5' },
          '50%': { top: '95%', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

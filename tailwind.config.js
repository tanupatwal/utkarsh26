/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Heritage Colors (Warm/Earthy)
        heritage: {
          saffron: '#FF9933', // Deep Saffron
          gold: '#FFD700',    // Bright Gold
          red: '#D41414',     // Crimson
          clay: '#B85C38',    // Terracotta
        },
        // Tech Colors (Cool/Neon)
        tech: {
          cyan: '#00F0FF',    // Neon Cyan
          purple: '#BC13FE',  // Neon Purple
          blue: '#2D6BFF',    // Electric Blue
          dark: '#050A14',    // Deep Space
        },
        // Base Colors
        navy: {
            dark: '#020617', // Slate 950
            card: '#0F172A', // Slate 900
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
      },
      backgroundImage: {
        'heritage-gradient': 'linear-gradient(135deg, #FF9933 0%, #D41414 100%)',
        'tech-gradient': 'linear-gradient(135deg, #00F0FF 0%, #BC13FE 100%)',
        'fusion-gradient': 'linear-gradient(90deg, #D41414 0%, #FF9933 25%, #00F0FF 75%, #BC13FE 100%)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'title-glow': 'titleGlow 3.5s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scroll-down': 'scrollDown 1.5s ease-in-out infinite',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        titleGlow: {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.2))',
          },
          '50%': { 
            filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.4)) drop-shadow(0 0 36px rgba(0,245,255,0.2))',
          },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-5%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(5%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scrollDown: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.3' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
      },
      boxShadow: {
        'heritage-subtle': '0 0 12px rgba(255, 77, 0, 0.25)',
        'tech-subtle': '0 0 10px rgba(0, 242, 255, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

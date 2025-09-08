import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EmotiBuild Design System Colors
        primary: {
          DEFAULT: "hsl(220 89.8% 52.4%)",
          50: "hsl(220 89.8% 95%)",
          100: "hsl(220 89.8% 90%)",
          200: "hsl(220 89.8% 80%)",
          300: "hsl(220 89.8% 70%)",
          400: "hsl(220 89.8% 60%)",
          500: "hsl(220 89.8% 52.4%)",
          600: "hsl(220 89.8% 45%)",
          700: "hsl(220 89.8% 35%)",
          800: "hsl(220 89.8% 25%)",
          900: "hsl(220 89.8% 15%)",
          950: "hsl(220 89.8% 10%)",
        },
        accent: {
          DEFAULT: "hsl(150 65% 5%)",
          50: "hsl(150 65% 95%)",
          100: "hsl(150 65% 85%)",
          200: "hsl(150 65% 75%)",
          300: "hsl(150 65% 65%)",
          400: "hsl(150 65% 55%)",
          500: "hsl(150 65% 45%)",
          600: "hsl(150 65% 35%)",
          700: "hsl(150 65% 25%)",
          800: "hsl(150 65% 15%)",
          900: "hsl(150 65% 10%)",
          950: "hsl(150 65% 5%)",
        },
        bg: "hsl(220 20% 10%)",
        surface: "hsl(220 20% 14%)",
        "text-primary": "hsl(220 10% 95%)",
        "text-secondary": "hsl(220 10% 80%)",
        border: "hsl(220 20% 20%)",
        input: "hsl(220 20% 18%)",
        ring: "hsl(220 89.8% 52.4%)",
        chart: {
          1: "hsl(220 89.8% 52.4%)",
          2: "hsl(150 65% 45%)",
          3: "hsl(280 65% 55%)",
          4: "hsl(30 80% 55%)",
          5: "hsl(340 75% 55%)",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      spacing: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 4px 12px hsla(0, 0%, 0%, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;

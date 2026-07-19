/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep-space / deep-grey base palette
        void: {
          900: "#05060a",
          800: "#0a0c14",
          700: "#10131f",
          600: "#161a2b",
        },
        // High-contrast light theme: monochrome ink accent (names kept so
        // existing utility classes recolor everywhere at once).
        neural: {
          cyan: "#0a0a0a", // ink (primary accent)
          blue: "#0a0a0a",
          violet: "#171717",
          glow: "#262626",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

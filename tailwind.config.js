/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "solana-gradient":
          "linear-gradient(223deg, #3B7B52 5.84%, #48287A 98.18%)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        primary: "Urbanist Variable, sans-serif",
        secondary: "Monofett, monospace",
        comic: "Comic Sans MS, sans-serif",
      },
      fontWeight: {
        regular: 400,
        black: 800,
      },
    },
  },
  plugins: [],
};

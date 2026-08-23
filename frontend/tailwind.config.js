export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#F7F7F5",
        panel: "#FFFFFF",
        ink: "#1F2A44",
        muted: "#6B7280",
        line: "#E5E3DD",
        accent: "#E8A33D",
        coral: "#E1614B",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
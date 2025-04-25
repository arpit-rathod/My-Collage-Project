export default {
  // plugins: [require('tailwind-scrollbar-hide')],
  plugins: [],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["border-green-500", "border-red-500", "border-yellow-500"],
  theme: { extend: {} },
};

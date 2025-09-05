export default {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     safelist: ["border-green-500", "border-red-500", "border-yellow-500"],
     theme: {
          extend: {},
          // screens: {
          //      "3xs": "16rem",  // 256px
          //      "2xs": "18rem",  // 288px
          //      xs: "20rem",     // 320px
          //      sm: "24rem",     // 384px
          //      md: "28rem",     // 448px
          //      lg: "42rem",     // 672px
          //      xl: "56rem",     // 896px
          //      "2xl": "64rem",  // 1024px
          //      "3xl": "80rem",  // 1280px
          //      "4xl": "96rem",  // 1536px
          //      "5xl": "108rem", // 1728px
          //      "6xl": "120rem", // 1920px
          // },
     },
     plugins: [require('tailwind-scrollbar-hide')],
};

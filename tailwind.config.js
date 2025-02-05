// tailwind.config.js
module.exports = {
  content: [
    "./HomeScreen.js",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customYellow: '#FEB803', 
        customRed: '#FF3838',
        customBg: '#111111',
        customSilver: '#252525',
        customGray7: "#777777",
        customSilver28: "#282828",
        customSilver2424: "#242424",
        customSilverB6: "#B6B6B6",
        customWhite: '#FAEDE1'

      },
      
    },
  },
  plugins: [],
};

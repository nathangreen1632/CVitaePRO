/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",  // ✅ Include index.html
        "./src/**/*.{js,ts,jsx,tsx}",  // ✅ Include all src files
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

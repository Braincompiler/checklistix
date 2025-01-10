/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    content: [
        './src/**/*.{html,ts}', //
        './node_modules/preline/preline.js',
    ],
    theme: {
        extend: {
            borderWidth: {
                1: '1px',
            },
            fontSize: {
                '2xs': '0.7rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'), //
        require('tailwindcss-primeui'),
        require('preline/plugin'),
    ],
};

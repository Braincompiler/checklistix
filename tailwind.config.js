// const colors = require('tailwindcss/colors');
const { $dt } = require('primeng/themes');

console.log($dt('amber.500').variable);

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    content: [
        './src/**/*.{html,ts}', //
        './node_modules/preline/preline.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: $dt('amber.50').variable,
                    100: $dt('amber.100').variable,
                    200: $dt('amber.200').variable,
                    300: $dt('amber.300').variable,
                    400: $dt('amber.400').variable,
                    500: $dt('amber.500').variable,
                    600: $dt('amber.600').variable,
                    700: $dt('amber.700').variable,
                    800: $dt('amber.800').variable,
                    900: $dt('amber.900').variable,
                    950: $dt('amber.950').variable,

                    DEFAULT: $dt('amber.500').variable,
                },
                secondary: {
                    50: $dt('sky.50').variable,
                    100: $dt('sky.100').variable,
                    200: $dt('sky.200').variable,
                    300: $dt('sky.300').variable,
                    400: $dt('sky.400').variable,
                    500: $dt('sky.500').variable,
                    600: $dt('sky.600').variable,
                    700: $dt('sky.700').variable,
                    800: $dt('sky.800').variable,
                    900: $dt('sky.900').variable,
                    950: $dt('sky.950').variable,

                    DEFAULT: $dt('sky.500').variable,
                },
            },
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
        require('preline/plugin'),
    ],
};

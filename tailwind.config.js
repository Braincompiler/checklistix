const colors = require('tailwindcss/colors');

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
                    ...colors.amber,
                    DEFAULT: colors.amber['500'],
                },
                secondary: {
                    ...colors.sky,
                    DEFAULT: colors.sky['500'],
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('preline/plugin'), //
    ],
};

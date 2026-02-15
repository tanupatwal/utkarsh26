/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                // "Void" palette - better than pure black
                void: '#050505',
                ash: '#121212',
                // "Acid" accents - high contrast against void
                'neon-lime': '#ccff00',
                'neon-purple': '#b026ff'
            },
            fontFamily: {
                // Define your Awwwards fonts here
                heading: ['"Clash Display"', 'sans-serif'],
                body: ['"Satoshi"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            transitionTimingFunction: {
                // The "Apple" easing
                'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
                // The "Elastic" snap
                'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            fontSize: {
                // Fluid typography clamp(min, preferred, max)
                'fluid-h1': 'clamp(2.5rem, 5vw + 1rem, 6rem)',
                'fluid-h2': 'clamp(2rem, 4vw + 1rem, 4.5rem)',
            }
        }
    },
    plugins: []
};

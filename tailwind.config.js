/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#f43f5e', // Rose
                    600: '#e11d48',
                    700: '#be123c',
                    800: '#9f1239',
                    900: '#881337',
                    950: '#4c0519',
                },
                accent: {
                    50: '#fdf4ff', // Keeping these from previous config as they weren't explicitly overwritten but might be needed
                    100: '#fae8ff',
                    200: '#f5d0fe',
                    300: '#f0abfc',
                    400: '#e879f9',
                    500: '#f59e0b', // Amber/Orange from user snippet
                    600: '#d97706',
                    700: '#a21caf', // Keeping purple accents for other UI elements
                    800: '#86198f',
                    900: '#701a75',
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'blob': 'blob 10s infinite',
                'spin-slow': 'spin 8s linear infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'loading-bar': 'loadingBar 1.5s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(1deg)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.2)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.8)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" }
                },
                shimmer: {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" }
                },
                loadingBar: {
                    "0%": { transform: "translateX(-150%)" },
                    "50%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(200%)" }
                }
            }
        },
    },
    plugins: [],
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const dev = 'dev';

export default defineConfig({
    plugins: [
        react({
            // Ensure automatic JSX runtime so `import React` is never needed
            jsxRuntime: 'automatic',
        }),
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: dev == 'dev' ? 'https://form-backend-qlqu.onrender.com' : 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
})

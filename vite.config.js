import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
                target: 'https://form-backend-qlqu.onrender.com',
                changeOrigin: true,
            },
        },
    },
})

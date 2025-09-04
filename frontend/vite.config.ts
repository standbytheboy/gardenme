import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({  
    plugins: [
        react(),
        tailwindcss()
    ],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost/gardenme/backend/public',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    }
})
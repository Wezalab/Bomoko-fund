import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import https from 'https'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/auth": {
        target: "https://46.202.168.1:7010",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/auth'),
        agent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
      },
      "/api/projects": {
        target: "https://46.202.168.1:7010",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/projects/, '/api/projects'),
        agent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
      },
    },
  },
})

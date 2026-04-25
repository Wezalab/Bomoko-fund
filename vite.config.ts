import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Where dev should forward API calls to. Defaults to the production API so
  // localhost can authenticate via Google without the backend needing a CORS
  // entry for http://localhost:5173.
  const devApiTarget = env.VITE_DEV_API_TARGET || 'https://api.bomoko.fund'

  return {
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
      // In dev, the frontend should call a relative `/api/...` path. Vite
      // forwards it to the real backend server-side, so the browser never
      // sees a cross-origin request and CORS / preflight issues disappear.
      proxy: {
        '/api': {
          target: devApiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
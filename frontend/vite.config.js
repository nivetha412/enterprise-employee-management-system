import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const envDir = '..'
  const env = loadEnv(mode, envDir, '')
  const backendTarget = env.BACKEND_URL || 'http://localhost:8080'

  return {
    envDir,
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
    },
  }
})

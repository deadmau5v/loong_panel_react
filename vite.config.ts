import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {},
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-dom': ['react', 'react-dom', 'lodash'], // 将'react-dom'单独打包成一个代码块
        },
      },
    },
  },
  server: {
    port: 13000,
    host: "0.0.0.0"
  }
})
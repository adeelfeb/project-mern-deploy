import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/subpath/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          vendor: ['axios', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit
  },
  server: {
    port: 3000, // Set your preferred port for the dev server
    open: true, // Automatically open the app in the browser
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux', 'axios', 'react-router-dom'],
  },
});
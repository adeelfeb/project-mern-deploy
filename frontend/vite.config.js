import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Set this to your subpath if needed
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
});
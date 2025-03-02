import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
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







// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import compression from 'vite-plugin-compression';
// import tailwindcss from 'tailwindcss';
// import autoprefixer from 'autoprefixer';
// import purgecss from '@fullhuman/postcss-purgecss';

// // PurgeCSS Configuration for TailwindCSS
// const purgeCssPlugin = purgecss({
//   content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
//   defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
// });

// export default defineConfig({
//   plugins: [
//     react(),
//     compression({ algorithm: 'brotliCompress' }) // Enable Brotli compression for better performance
//   ],
//   css: {
//     postcss: {
//       plugins: [
//         tailwindcss(),
//         autoprefixer(),
//         ...(process.env.NODE_ENV === 'production' ? [purgeCssPlugin] : []) // Only apply PurgeCSS in production
//       ],
//     },
//   },
//   base: '/',
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           react: ['react', 'react-dom'],
//           redux: ['@reduxjs/toolkit', 'react-redux'],
//           vendor: ['axios', 'react-router-dom'],
//         },
//       },
//     },
//     chunkSizeWarningLimit: 1000,
//     minify: 'terser',
//   },
//   server: {
//     port: 3000,
//     open: true,
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux', 'axios', 'react-router-dom'],
//   },
// });

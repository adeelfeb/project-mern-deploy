// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5000, // Define your desired port
//     hmr: {
//       protocol: 'ws', // WebSocket protocol
//       host: 'localhost', // WebSocket host
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Set this to your subpath if needed, e.g., '/subpath/'
  server: {
    port: 5000, // Define your desired port
    hmr: {
      protocol: 'ws', // WebSocket protocol
      host: 'localhost', // WebSocket host
    },
  },
});
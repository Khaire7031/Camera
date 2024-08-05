import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 10000, // Ensure this is the port Render expects
    host: true, // Listen on all network interfaces
  },
});

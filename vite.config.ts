import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ecommerce-admin",
  define: {
    global: "window",
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

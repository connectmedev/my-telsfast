import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  // No need to define env vars manually here;
  // Vite injects import.meta.env.VITE_... automatically.
})
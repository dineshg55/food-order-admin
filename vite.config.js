import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/restaurant($|/.*)': 'http://localhost:8080',
      '^/menuItem($|/.*)': 'http://localhost:8080',
      '^/customer($|/.*)': 'http://localhost:8080',
      '^/order($|/.*)': 'http://localhost:8080',
      '^/orderItem($|/.*)': 'http://localhost:8080',
      '^/payment($|/.*)': 'http://localhost:8080',
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adjust this if your GitHub repository name is different.
  base: process.env.GITHUB_REPOSITORY ? '/work-hours/' : '/',
})

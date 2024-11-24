import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  root: 'src',
  build: {
    outDir: '../dist'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}); 
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    https: true
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
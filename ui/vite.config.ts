import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Use the config file's directory as the project root (works when running inside `ui/`)
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});

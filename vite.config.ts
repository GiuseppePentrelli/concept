import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `vite build --mode pages` pubblica sotto https://giuseppepentrelli.github.io/concept/
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/concept/' : '/',
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
}));

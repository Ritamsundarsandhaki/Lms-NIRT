
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // server: {
  //   host: '0.0.0.0',  // <--- This allows Vite to listen on all network interfaces
  //   port: 5173,       // <--- (optional) default Vite port is 5173
  //   allowedHosts: ['pp.ritam.site'],  // allows reverse proxy / domain
  // },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@services': path.resolve(__dirname, './src/services'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@config': path.resolve(__dirname, './src/config'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://global-earthquakes-a4oc.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3')) return 'charts';
            if (id.includes('react-router')) return 'router';
            if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux';
            if (id.includes('formik') || id.includes('yup')) return 'forms';
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor';
          }
        },
      },
    },
  },
});

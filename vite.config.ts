import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Inject the API Key provided by the user directly into the build
  const extendedEnv = {
    ...env,
    API_KEY: "AIzaSyAgUbQqcNGsvIqHtic02zLQux6-HDIkpqQ"
  };

  return {
    plugins: [react()],
    define: {
      'process.env': extendedEnv
    }
  };
});
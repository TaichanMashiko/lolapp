import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Prioritize environment variables (Vercel) -> Local .env -> Hardcoded fallback
  // SECURITY NOTE: PRIVATE_KEY must be set via Vercel Environment Variables for security.
  const extendedEnv = {
    ...env,
    API_KEY: env.API_KEY || "AIzaSyAgUbQqcNGsvIqHtic02zLQux6-HDIkpqQ", 
    SPREADSHEET_ID: env.SPREADSHEET_ID || "1A3tjpUcgwqQYn_N7wKR43BdusS3sJ0F272NZ3Ll_KpQ",
    SERVICE_ACCOUNT_EMAIL: env.SERVICE_ACCOUNT_EMAIL || "lolapp@lolapp-484403.iam.gserviceaccount.com",
    PRIVATE_KEY: env.PRIVATE_KEY || ""
  };

  return {
    plugins: [react()],
    define: {
      'process.env': extendedEnv
    }
  };
});
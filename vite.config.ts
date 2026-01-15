import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Prioritize environment variables (Vercel) -> Local .env -> Hardcoded fallback
  // NOTE: Hardcoding the PRIVATE_KEY here allows the app to work without Env Vars, 
  // but be aware this exposes the key in the client-side bundle.
  const extendedEnv = {
    ...env,
    API_KEY: env.API_KEY || "AIzaSyAgUbQqcNGsvIqHtic02zLQux6-HDIkpqQ", 
    SPREADSHEET_ID: env.SPREADSHEET_ID || "1A3tjpUcgwqQYn_N7wKR43BdusS3sJ0F272NZ3Ll_KpQ",
    SERVICE_ACCOUNT_EMAIL: env.SERVICE_ACCOUNT_EMAIL || "lolapp@lolapp-484403.iam.gserviceaccount.com",
    PRIVATE_KEY: env.PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD8VDcWgaQb8A5P\\n3ab6VJARww7WmqjIR0xJeN1KZEZdpFtrX+TmEzg/PbEqqkl5kb6yoBQn7fjmcLnB\\nwMvIkuB8cPVOmT0PX+kr4+XXW3SbRQqsvFdAf8ofZMmFvtFwpr89x7y5seBHCPeO\\nSV+Q6dI4lxdHjgEeLQCofXRUaetjaJj+FPambEyFfqYdh/tVhKfiimYDMXUZANap\\nhKuNBEnpLnmkNrfYCYjU2XjrtDpMxRCbIwheCQyKPStwkaCMnP8tWTa1hVlKK/e9\\n7AywcQsFRhJN92x/PzEj5LViG29QMcOLg0e4FxJjywVvdtdmfzdN961gbe8lgcTQ\\nO+53aLubAgMBAAECggEAUx+VFDN58gAnXtUIfF/eJBPLcBP79RpTvcJ0t9yHt7J8\\nsUciW07KkT7L/d+iG8vQ8/w7F5pUC+nnr7XJDBaioCwAC7f8fvOcFyrY3RSSOdJJ\\nPXVAEw3l8mib4JTnXwJ3bq09dTjtRslj7/oo4s68Q4s2jopvwNaXaGoHqAVKl3DG\\nvRfBKfY/DiUSJsMBrTfFnEDGGJTvVJ1dDvOwOppUInBrIeg/+f00z5or3rqtBkcH\\nD+XaUZ9nwtgNMvKj9SWOCmlGxTKWCwD00XB4QzUKic2S/VVYm/EkQjfPANCr9ZaH\\nXWNdWRWExoDwBUTAkrhJb7v66XYoTXtAx/59EQGilQKBgQD/IB5oC9Aja8FWZpoB\\n5tKzqi3EcuTSaw3FgNu7YpAJ76m3lVLUry28Jy7zFi9+ApCNj5VTAGjdYNoi4fYc\\nKpxiyaGtM8IzmL12cxHx111jNPN8c0R88WTpHVRLtkqPIJFRcD7UjDwbvO0VA/sz\\nffAK5k37mDzg6YTw/UT4Xq+1hQKBgQD9MaRzrbzGU/DskCvM+bz3P958U5gLhiEa\\nJ69GHkUMP6NR+F43wse3EHC0k/UKuoILeUv6p+9LLybhFUO06B4oaRu/52zeTaHN\\nnwCG7xe/2drTbpbPZ5paxK0tPkd0XhpRoSYlG3g9F3ts/9wpw3JT9Ky0Xh5V0S3x\\nypD5JmRmnwKBgQDrvTT7dTbtE+uBN6tE6JF3HF/P705KtEr0XZ4sJuXrmH3dOehg\\nyEHdYuN6ENzvddU2SR90o6NCM/U8WEj+O81nZuKy1Wm0HYWsBqXlLtiHC+2U6Dm3\\nraJN2SEEGLwKRtCgTLRx1+bOxqLXUWdzbAI7QBV8zm4qcPy7ZXuueGeptQKBgQCd\\n9Th5iqw4tumZTCBnUm6XedsdiTFUDyvbm2J3xi6hg5oqa16sPvJFvRXzMlMvjEfR\\nTK0gBWD+cL46sf95f05BO8G6KXD8B0aod0fm5obUg99HBLlFT4c2lXjMvwvpB0Q4\\nJOcdQ1PyGRJBYCZET9ClnAGazRTzyPp23D8xkMgWVQKBgF9/SMs0u7vfU60CQlHh\\nnjN36y/IrzfRL2kNLEl7kBRua2vePRuO+sQx5ChxwxXm6vFZ8MODa6sVHrCic+co\\n825riCeXHvsLZ43aOA/QQifjvoXb3iVx7eaB9Uuc0dTrQNZPtaRZw1rasNVb1Zjg\\nVeU0OJs21d8bWUi8sVSSziq9\\n-----END PRIVATE KEY-----\\n"
  };

  return {
    plugins: [react()],
    define: {
      'process.env': extendedEnv
    }
  };
});
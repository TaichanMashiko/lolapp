// ==============================================================================
// ⚠️ SECURITY & DEPLOYMENT INSTRUCTION:
// Vercelにデプロイする際は、Settings > Environment Variables で以下の変数を設定してください。
// 
// 1. API_KEY: Gemini APIキー
// 2. SPREADSHEET_ID: スプレッドシートのID
// 3. SERVICE_ACCOUNT_EMAIL: サービスアカウントのメールアドレス
// 4. PRIVATE_KEY: サービスアカウントの秘密鍵 (JSON内の private_key の値すべて)
// ==============================================================================

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1A3tjpUcgwqQYn_N7wKR43BdusS3sJ0F272NZ3Ll_KpQ';

export const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL || 'lolapp@lolapp-484403.iam.gserviceaccount.com';

// Handle potential newline escaping issues when reading from env vars (common in Vercel)
export const PRIVATE_KEY = (process.env.PRIVATE_KEY || '').replace(/\\n/g, '\n');

export const SHEET_NAMES = {
  KNOWLEDGE_BASE: 'Knowledge_Base',
  MATCH_HISTORY: 'Match_History'
};
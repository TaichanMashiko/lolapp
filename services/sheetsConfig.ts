// ==============================================================================
// ⚠️ SECURITY WARNING:
// このファイルには秘密鍵が含まれます。
// 公開リポジトリ（GitHub等）にプッシュすると、スプレッドシートが悪用されるリスクがあります。
// Vercelなどの環境変数を使用するか、リポジトリをPrivateに設定してください。
// ==============================================================================

// 使用するスプレッドシートのID (URLの /d/xxxxx/edit の xxxxx 部分)
export const SPREADSHEET_ID = '1A3tjpUcgwqQYn_N7wKR43BdusS3sJ0F272NZ3Ll_KpQ';

// Google Cloud Console からダウンロードしたJSONファイルの中身を転記してください

// client_email の値を貼り付け
export const SERVICE_ACCOUNT_EMAIL = 'YOUR_SERVICE_ACCOUNT_EMAIL_HERE';

// private_key の値を貼り付け
// -----BEGIN PRIVATE KEY----- から -----END PRIVATE KEY----- まで全て含めてください。
// 改行コード (\n) はそのままで構いません。
export const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----`;

export const SHEET_NAMES = {
  KNOWLEDGE_BASE: 'Knowledge_Base',
  MATCH_HISTORY: 'Match_History'
};
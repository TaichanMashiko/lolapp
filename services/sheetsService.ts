import * as jsrsasign from 'jsrsasign';
import { SPREADSHEET_ID, SERVICE_ACCOUNT_EMAIL, PRIVATE_KEY } from './sheetsConfig';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

let cachedToken: string | null = null;
let tokenExpiration: number = 0;

/**
 * Generates a JWT and exchanges it for an Access Token
 * This mimics what a backend library would do but runs in the browser.
 */
const getAccessToken = async (): Promise<string> => {
  // Return cached token if still valid (with 30s buffer)
  if (cachedToken && Date.now() < tokenExpiration - 30000) {
    return cachedToken;
  }

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: SCOPES,
    aud: TOKEN_URL,
    exp: now + 3600, // 1 hour
    iat: now,
  };

  const header = { alg: 'RS256', typ: 'JWT' };
  
  // Sign JWT
  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(claim);
  
  // Clean up private key string just in case
  const cleanKey = PRIVATE_KEY.replace(/\\n/g, '\n');
  
  const signature = jsrsasign.KJUR.jws.JWS.sign(
    'RS256',
    sHeader,
    sPayload,
    cleanKey
  );

  // Exchange JWT for Access Token
  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('assertion', signature);

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Auth Failed: ${err.error_description || err.error}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiration = Date.now() + (data.expires_in * 1000);

  return data.access_token;
};

/**
 * Appends data to the spreadsheet
 * @param range "SheetName!A:A"
 * @param values Array of arrays (rows)
 */
export const appendToSheet = async (sheetName: string, values: any[][]) => {
  if (SERVICE_ACCOUNT_EMAIL.includes('YOUR_SERVICE_ACCOUNT')) {
    console.warn("Service Account credentials not configured in sheetsConfig.ts");
    return;
  }

  try {
    const accessToken = await getAccessToken();
    
    const range = `${sheetName}!A1`; // Appending to A1 will automatically find the last row
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const body = {
      values: values
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Sheets API Error:', error);
      throw new Error(`Sheets API Error: ${error.error?.message}`);
    }

    const result = await response.json();
    console.log('Appended to sheet:', result);
    return result;

  } catch (error) {
    console.error("Failed to append to sheet:", error);
    throw error;
  }
};
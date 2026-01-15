import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedAdvice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const adviceSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: "具体的なアドバイス内容 (例: レーン戦で先行したらゾーニングする)" },
      role_tags: { type: Type.STRING, description: "対象ロール (トップ, ミッド, 全般 など)" },
      champion_tags: { type: Type.STRING, description: "対象チャンピオン (アーリ, ヤスオ, 全般 など)" },
      category: { type: Type.STRING, description: "カテゴリ (レーン戦, 集団戦, 視界, マクロ)" },
      importance: { type: Type.STRING, description: "重要度 (高 / 中 / 低)" }
    },
    required: ["content", "role_tags", "champion_tags", "category", "importance"]
  }
};

export const analyzeTranscript = async (url: string, transcriptText?: string): Promise<GeneratedAdvice[]> => {
  // Construct prompt based on available input
  let contentPart = "";
  if (transcriptText && transcriptText.trim()) {
    contentPart = `対象テキスト:\n${transcriptText.substring(0, 30000)}`;
  } else {
    contentPart = `
    対象動画URL: ${url}
    
    【重要】
    Google Searchツールを使用して、この動画の内容、要約、または文字起こしを検索してください。
    動画内で語られている具体的なLoLの上達アドバイスを抽出してください。
    `;
  }

  const prompt = `
    あなたはLeague of Legends (LoL) のプロコーチです。
    提供された情報（動画URLからの検索結果、またはテキスト）から、具体的な上達のためのアドバイスを抽出してください。
    
    出力は指定されたJSONスキーマに従ったリスト形式のみで返してください。
    Markdownのコードブロックは使用しないでください。

    【抽出のルール】
    1. **具体的なアクション**: 抽象的な精神論ではなく、「〇〇の時は××する」といった具体的な行動指針を抽出してください。
    2. **タグ付け**: 
       - チャンピオン名は可能な限り日本語（カタカナ）で表記してください（例: Ahri -> アーリ）。
       - ロールは「トップ」「ジャングル」「ミッド」「ADC」「サポート」または「全般」としてください。
    3. **カテゴリ**: レーン戦 / 集団戦 / 視界 / マクロ のいずれかに分類してください。
    4. **重要度**: 高 / 中 / 低 で評価してください。
    
    ${contentPart}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: adviceSchema,
        systemInstruction: "あなたは論理的で具体的なアドバイスをするLoLコーチです。URLが提供された場合はGoogle検索を活用して内容を把握してください。",
        tools: [{googleSearch: {}}]
      }
    });

    const text = response.text;
    
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      console.log("Grounding Chunks:", response.candidates[0].groundingMetadata.groundingChunks);
    }

    if (!text) return [];

    const parsed = JSON.parse(text);
    return parsed as GeneratedAdvice[];
  } catch (error) {
    console.error("Gemini Analysis Error Full Object:", error);
    // Rethrow with a more helpful message if possible
    throw new Error(`解析エラー: ${error instanceof Error ? error.message : '不明なエラー'}。モデル名やAPIキーを確認してください。`);
  }
};

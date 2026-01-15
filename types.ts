export enum Role {
  Top = 'トップ',
  Jungle = 'ジャングル',
  Mid = 'ミッド',
  ADC = 'ADC',
  Support = 'サポート',
  All = '全般'
}

export enum Importance {
  High = '高',
  Medium = '中',
  Low = '低'
}

export enum GameResult {
  Win = 'Win',
  Loss = 'Loss'
}

export interface Advice {
  id: string;
  content: string;
  role_tags: string; // Comma separated string
  champion_tags: string; // Comma separated string
  category: string;
  importance: string; // 高, 中, 低
  video_url?: string;
  video_title?: string;
  timestamp: string;
}

export interface MatchLog {
  id: string;
  timestamp: string;
  role: Role;
  champion: string;
  result: GameResult;
  achievement_rate: number;
  checked_count: number;
  total_count: number;
  note: string;
  checked_advice_ids: string[];
}

// For Gemini Generation
export interface GeneratedAdvice {
  content: string;
  role_tags: string;
  champion_tags: string;
  category: string;
  importance: string;
}
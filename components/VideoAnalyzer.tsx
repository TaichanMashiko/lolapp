import React, { useState } from 'react';
import { analyzeTranscript } from '../services/geminiService';
import { saveAdvice } from '../services/storageService';
import { Advice } from '../types';
import { Loader2, Youtube, Save, FileText, CheckCircle, Search } from 'lucide-react';

const VideoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedAdvice, setExtractedAdvice] = useState<Advice[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url && !transcript.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setSaved(false);

    try {
      const results = await analyzeTranscript(url, transcript);
      const newAdvice: Advice[] = results.map(r => ({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        video_url: url,
        video_title: url ? 'Video Analysis' : 'Manual Note',
        content: r.content,
        role_tags: r.role_tags,
        champion_tags: r.champion_tags,
        category: r.category,
        importance: r.importance
      }));
      setExtractedAdvice(newAdvice);
    } catch (e) {
      setError("解析に失敗しました。URLが正しいか確認するか、APIキーの設定を確認してください。");
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    saveAdvice(extractedAdvice);
    setSaved(true);
    setExtractedAdvice([]);
    setTranscript('');
    setUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-cyan-400">
          <Youtube className="w-6 h-6" />
          動画からの知識抽出
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          YouTube動画のURLを入力してください。GeminiがWeb検索機能を使用して動画の内容を分析し、
          上達のための重要なポイントを自動で抽出します。
          <br />
          <span className="text-xs text-slate-500">※補助的にメモや字幕テキストを入力することも可能です。</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">動画URL <span className="text-red-400 text-xs">(推奨)</span></label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <Youtube className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">補足メモ / 字幕テキスト <span className="text-slate-500 text-xs">(任意)</span></label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none font-mono text-sm"
              placeholder="URLだけで解析できない場合や、特定のメモがある場合はここに入力してください..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!url && !transcript)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isAnalyzing || (!url && !transcript)
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 解析中...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> 解析開始
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {extractedAdvice.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-emerald-400">抽出されたポイント ({extractedAdvice.length}件)</h3>
            {!saved ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" /> 知識ベースに保存
              </button>
            ) : (
              <span className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle className="w-5 h-5" /> 保存完了
              </span>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {extractedAdvice.map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-700 rounded text-slate-300">{item.category}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-blue-900/50 text-blue-300 rounded">{item.role_tags}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-purple-900/50 text-purple-300 rounded">{item.champion_tags}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{item.content}</p>
                <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider font-bold">
                   重要度: <span className={item.importance === '高' ? 'text-red-400' : 'text-slate-400'}>{item.importance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalyzer;
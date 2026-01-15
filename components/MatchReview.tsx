import React, { useState, useMemo } from 'react';
import { getAdvice, saveMatch } from '../services/storageService';
import { Role, GameResult, MatchLog } from '../types';
import { Target, Trophy, XCircle, ChevronRight, CheckSquare, Square, ClipboardList, Loader2 } from 'lucide-react';

// Use the Japanese role values directly
const ROLES = Object.values(Role).filter(r => r !== Role.All);

const MatchReview: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Step 1 State
  const [selectedRole, setSelectedRole] = useState<Role>(Role.Mid);
  const [champion, setChampion] = useState('');
  const [result, setResult] = useState<GameResult>(GameResult.Win);
  
  // Step 2 State
  const [note, setNote] = useState('');
  const [checkedAdviceIds, setCheckedAdviceIds] = useState<Set<string>>(new Set());
  
  // Filtered advice based on Role and Champion
  const relevantAdvice = useMemo(() => {
    if (step === 1) return [];
    const allAdvice = getAdvice();
    return allAdvice.filter(a => {
      // Logic: (Saved Role includes Selected OR 'All') AND (Saved Champion includes Selected OR 'All')
      // Note: role_tags/champion_tags are comma separated strings.
      
      const roleTags = a.role_tags.split(',').map(t => t.trim());
      const champTags = a.champion_tags.split(',').map(t => t.trim().toLowerCase());
      
      const roleMatch = roleTags.some(t => t === selectedRole || t === Role.All || t === '全般' || t === 'All');
      
      const champInput = champion.toLowerCase();
      const champMatch = champTags.some(t => 
        !champInput || 
        t === 'all' || 
        t === '全般' || 
        t.includes(champInput) ||
        champInput.includes(t)
      );
      
      return roleMatch && champMatch;
    });
  }, [step, selectedRole, champion]);

  const handleNext = () => {
    if (!champion) return;
    setStep(2);
  };

  const toggleAdvice = (id: string) => {
    const next = new Set(checkedAdviceIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedAdviceIds(next);
  };

  const handleFinish = async () => {
    setIsSaving(true);
    const total = relevantAdvice.length;
    const checked = checkedAdviceIds.size;
    const rate = total === 0 ? 0 : Math.round((checked / total) * 100);

    const matchLog: MatchLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      role: selectedRole,
      champion,
      result,
      achievement_rate: rate,
      checked_count: checked,
      total_count: total,
      note,
      checked_advice_ids: Array.from(checkedAdviceIds)
    };

    try {
      await saveMatch(matchLog);
      
      // Reset form
      setStep(1);
      setChampion('');
      setNote('');
      setCheckedAdviceIds(new Set());
      alert(`記録完了！ 達成率: ${rate}%`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900/50 p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">
              {step === 1 ? '試合情報入力' : '実践振り返り'}
            </h2>
          </div>
          <div className="flex gap-2 mt-4">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">ロール</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        selectedRole === r 
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">チャンピオン名</label>
                <input
                  type="text"
                  value={champion}
                  onChange={(e) => setChampion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="例: アーリ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">試合結果</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setResult(GameResult.Win)}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      result === GameResult.Win
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    <Trophy className="w-6 h-6" /> 勝利 (Win)
                  </button>
                  <button
                    onClick={() => setResult(GameResult.Loss)}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      result === GameResult.Loss
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    <XCircle className="w-6 h-6" /> 敗北 (Loss)
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  disabled={!champion}
                  className="flex items-center gap-2 bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  次へ <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-sm font-bold text-slate-400 mb-3">今回意識できたポイントは？</h3>
                {relevantAdvice.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-4">
                    {selectedRole} / {champion} に該当するアドバイスが見つかりませんでした。<br/>
                    「動画からの知識抽出」でアドバイスを追加してください。
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {relevantAdvice.map(advice => (
                      <div
                        key={advice.id}
                        onClick={() => toggleAdvice(advice.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                          checkedAdviceIds.has(advice.id)
                          ? 'bg-cyan-900/20 border-cyan-500/50'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className={`mt-1 ${checkedAdviceIds.has(advice.id) ? 'text-cyan-400' : 'text-slate-500'}`}>
                          {checkedAdviceIds.has(advice.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className={`text-sm ${checkedAdviceIds.has(advice.id) ? 'text-cyan-100' : 'text-slate-300'}`}>
                            {advice.content}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                              {advice.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">振り返りメモ (任意)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                  placeholder="良かった点、改善点など..."
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white font-medium"
                >
                  戻る
                </button>
                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-bold uppercase">達成率</div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {relevantAdvice.length > 0 
                        ? Math.round((checkedAdviceIds.size / relevantAdvice.length) * 100) 
                        : 0}%
                    </div>
                  </div>
                  <button
                    onClick={handleFinish}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 disabled:opacity-50"
                  >
                     {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
                     記録して終了
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchReview;
import React, { useEffect, useState } from 'react';
import { getMatches, exportMatchHistoryCSV } from '../services/storageService';
import { MatchLog, GameResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Download, TrendingUp, Activity, ExternalLink } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<MatchLog[]>([]);

  useEffect(() => {
    // Reverse matches so oldest is first for the line chart
    setMatches([...getMatches()].reverse());
  }, []);

  const handleExport = () => {
    const csv = exportMatchHistoryCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lol_match_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const chartData = matches.map((m, i) => ({
    name: `試合${i + 1}`,
    rate: m.achievement_rate,
    result: m.result,
    champion: m.champion
  }));

  // Calculate Win Rate based on Achievement Rate buckets
  const buckets = [0, 25, 50, 75, 100];
  const bucketData = buckets.slice(0, -1).map((lower, i) => {
    const upper = buckets[i + 1];
    const inBucket = matches.filter(m => m.achievement_rate >= lower && m.achievement_rate < upper);
    const wins = inBucket.filter(m => m.result === GameResult.Win).length;
    const winRate = inBucket.length > 0 ? (wins / inBucket.length) * 100 : 0;
    return {
      name: `${lower}-${upper}%`,
      winRate: Math.round(winRate),
      count: inBucket.length
    };
  });

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1A3tjpUcgwqQYn_N7wKR43BdusS3sJ0F272NZ3Ll_KpQ/edit?gid=0#gid=0";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">パフォーマンス分析</h1>
          <p className="text-slate-400">意識の達成度と勝率の相関を可視化します。</p>
        </div>
        <div className="flex gap-3">
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-900/50 hover:bg-green-800/50 text-green-400 border border-green-700/50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" /> Google Sheetsを開く
          </a>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" /> CSVエクスポート
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" /> 達成率の推移
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                  itemStyle={{ color: '#67e8f9' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Correlation Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> 意識レベル別勝率
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bucketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} unit="%" domain={[0, 100]} />
                <Tooltip
                  cursor={{fill: '#374151', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                />
                <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                  {bucketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.winRate > 50 ? '#10b981' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-slate-200">最近の試合履歴</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-slate-200 uppercase tracking-wider font-semibold text-xs">
              <tr>
                <th className="p-4">日時</th>
                <th className="p-4">チャンピオン</th>
                <th className="p-4">ロール</th>
                <th className="p-4">結果</th>
                <th className="p-4 text-right">達成率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {[...matches].reverse().slice(0, 5).map((match) => (
                <tr key={match.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 whitespace-nowrap">{new Date(match.timestamp).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-slate-200">{match.champion}</td>
                  <td className="p-4">{match.role}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      match.result === GameResult.Win ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {match.result === GameResult.Win ? '勝利' : '敗北'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono text-cyan-400">{match.achievement_rate}%</span>
                    <span className="text-xs ml-1 text-slate-600">({match.checked_count}/{match.total_count})</span>
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    まだ記録がありません。「試合入力」から最初の記録を作成しましょう！
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
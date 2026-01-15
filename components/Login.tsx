import React, { useState } from 'react';
import { User, ArrowRight, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">LoL Mindset Tracker</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            あなたの個人の上達記録を作成します。<br/>
            Googleアカウントのメールアドレスなどを入力してください。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              メールアドレス
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                placeholder="summoner@example.com"
                required
              />
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ※初回のみ入力が必要です。次回からは自動でログインされます。
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/30"
          >
            はじめる <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700">
           <p className="text-[10px] text-center text-slate-600 leading-relaxed">
             このアプリは公式のGoogleログインAPIを使用していません。<br/>
             入力されたメールアドレスは、お使いのブラウザ内にデータを保存・区別するためのIDとしてのみ使用されます。
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, BrainCircuit, LogOut } from 'lucide-react';
import VideoAnalyzer from './components/VideoAnalyzer';
import MatchReview from './components/MatchReview';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { setCurrentUser, getCurrentUser } from './services/storageService';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
        isActive ? 'text-cyan-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
      }`
    }
  >
    <Icon className="w-6 h-6" />
    <span className="text-[10px] font-bold tracking-wider">{label}</span>
  </NavLink>
);

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check local storage for persisted session
    const persistedEmail = getCurrentUser();
    if (persistedEmail) {
      setUserEmail(persistedEmail);
    }
    setIsInitialized(true);
  }, []);

  const handleLogin = (email: string) => {
    setCurrentUser(email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setCurrentUser(''); // This will clear storage
    setUserEmail(null);
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  if (!userEmail) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
        {/* Mobile Navigation (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 p-2 flex justify-around">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="データ分析" />
          <NavItem to="/review" icon={Gamepad2} label="試合入力" />
          <NavItem to="/analyze" icon={BrainCircuit} label="知識抽出" />
        </nav>

        {/* Desktop Navigation (Sidebar) */}
        <nav className="hidden md:flex flex-col w-24 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 py-6 items-center gap-8 z-50">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <div className="flex flex-col gap-4 w-full px-2 flex-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="データ分析" />
            <NavItem to="/review" icon={Gamepad2} label="試合入力" />
            <NavItem to="/analyze" icon={BrainCircuit} label="知識抽出" />
          </div>
          <div className="px-2 mb-4">
            <button 
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              title="ログアウト"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-[10px] font-bold">ログアウト</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0 overflow-y-auto h-screen scroll-smooth">
          <div className="p-4 md:p-8">
            <div className="flex justify-end md:hidden mb-4">
               <button onClick={handleLogout} className="text-xs text-red-400 flex items-center gap-1">
                 <LogOut className="w-3 h-3" /> ログアウト
               </button>
            </div>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/review" element={<MatchReview />} />
              <Route path="/analyze" element={<VideoAnalyzer />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
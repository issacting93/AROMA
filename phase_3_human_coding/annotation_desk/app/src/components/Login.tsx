import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg ring-4 ring-slate-800">
            A
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">AROMA Desk</h1>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">Researcher Authentication</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              placeholder="researcher@aroma.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Laboratory'}
          </button>
        </form>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only<br/>
            AROMA Protocol v0.2.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

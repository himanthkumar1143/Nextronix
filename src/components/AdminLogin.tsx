import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Zap,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Credentials are required to access the laboratory.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const success = await adminLogin(email, password);
      if (!success) {
        setError('Authorization failed. Invalid email coordinate or security passcode.');
      }
    } catch (err: any) {
      setError(err.message || 'A network anomaly occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 sm:p-12 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center space-y-6 mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-slate-950 text-emerald-500 rounded-3xl shadow-xl shadow-emerald-500/10">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Admin Panel</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Laboratory credentials required for access.</p>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex gap-3 items-center text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-tight"
            >
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Coordinate</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nextronix.com"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Laboratory Passcode</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-70 shadow-xl shadow-slate-900/10 dark:shadow-emerald-900/10 cursor-pointer"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>AUTHENTICATE SESSION <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          {/* Helper info */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rapid Ingress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Sync</span>
            </div>
          </div>
        </div>

        {/* Footer brand */}
        <div className="mt-8 flex flex-col items-center gap-3 opacity-30 select-none">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm font-black tracking-tighter">NEXTRONIX</span>
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Security Infrastructure v4.2</p>
        </div>
      </motion.div>

    </div>
  );
};
export default AdminLogin;

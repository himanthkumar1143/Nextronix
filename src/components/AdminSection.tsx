import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, ExternalLink, Shield } from 'lucide-react';

export const AdminSection: React.FC = () => {
  const { user, isAdmin } = useApp();
  const [showLoginPage, setShowLoginPage] = useState(false);

  // If already logged in and admin, show dashboard
  if (user && isAdmin) {
    return <AdminDashboard />;
  }

  // If user clicked login, show login form
  if (showLoginPage) {
    return (
      <div className="py-20">
        <button 
          onClick={() => setShowLoginPage(false)}
          className="max-w-md mx-auto block mb-8 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors px-4"
        >
          ← BACK TO GATEWAY
        </button>
        <AdminLogin />
      </div>
    );
  }

  // Gateway entry point
  return (
    <div className="min-h-[70vh] flex items-center justify-center font-sans px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        <div className="space-y-6">
          <motion.div
            animate={{ 
              rotateY: [0, 180, 360],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-slate-900 dark:bg-emerald-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20"
          >
            <ShieldCheck className="h-12 w-12" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Command Center</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
              Secure administrative access for laboratory management, logistics oversight, and catalog synchronization.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => setShowLoginPage(true)}
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/10 cursor-pointer uppercase tracking-widest text-xs"
          >
            Login to Admin Panel <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-8">
           <div className="flex flex-col items-center gap-2">
             <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
               <Shield className="h-5 w-5" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encrypted Auth</p>
           </div>
           <div className="flex flex-col items-center gap-2">
             <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
               <ShieldCheck className="h-5 w-5" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Hub</p>
           </div>
           <div className="flex flex-col items-center gap-2">
             <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
               <Shield className="h-5 w-5" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catalog Sync</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
export default AdminSection;

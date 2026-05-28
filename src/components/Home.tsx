/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  ShoppingBag,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react';

export const Home: React.FC = () => {
  const { 
    submitComplaint,
    addNotification,
    setPage
  } = useApp();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addNotification('Please fill all fields', 'error');
      return;
    }
    setSubmitting(true);
    const success = await submitComplaint({ 
      customerName: form.name, 
      customerEmail: form.email, 
      subject: 'Service Complaint',
      message: form.message 
    });
    setSubmitting(false);
    if (success) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="space-y-0 font-sans overflow-hidden">
      
      {/* 1. Hero Section: Improved High-Contrast Layout */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80" 
            alt="Nextronix Premium Background" 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950"></div>
        </div>

        <div className="relative z-10 max-w-4xl px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase"
          >
            <Sparkles className="h-4 w-4 animate-pulse" /> Advanced Hardware Node
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none"
            >
              NEXTRO<span className="text-emerald-500">NIX</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-xl text-slate-300 font-medium tracking-wide max-w-3xl mx-auto leading-relaxed"
            >
              The unified endpoint for pro-grade workstation hardware and precision mechanical instruments.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button 
              onClick={() => setPage('products')}
              className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center gap-4 group transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-600/30 text-sm uppercase tracking-widest"
            >
              SYSTEM CATALOG <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => setPage('my-orders')}
              className="px-12 py-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 font-black rounded-2xl flex items-center gap-4 transition-all transform hover:scale-105 active:scale-95 text-sm uppercase tracking-widest"
            >
              MY ORDERS <Clock className="h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Dynamic scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        >
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent"></div>
        </motion.div>
      </section>

      {/* 3. Global Support Section */}
      <section className="py-32 bg-white dark:bg-slate-100 dark:bg-slate-950 relative">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Voice an Issue</h2>
              <div className="h-1.5 w-16 bg-emerald-500 rounded-full"></div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Experience any technical friction or logistics anomalies? Our support architects are standing by to resolve any complaints.
            </p>
            <div className="space-y-4">
              {[
                { icon: Zap, text: '24-hour response window guaranteed' },
                { icon: ShieldCheck, text: 'Full shipment protection protocols' },
                { icon: MessageSquare, text: 'Direct line to hardware engineers' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wide">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <item.icon className="h-5 w-5" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Report Received</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Your complaint coordinate has been logged. An architect will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Identified Operating Name"
                      className="w-full px-5 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Coordinate</label>
                    <input 
                      type="email" 
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder="comm-link@host.com"
                      className="w-full px-5 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Complaint Log</label>
                    <textarea 
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      placeholder="Describe the technical or logistics discrepancy..."
                      className="w-full px-5 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-medium resize-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>SUBMIT REPORT <Send className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

    </div>
  );
};
export default Home;

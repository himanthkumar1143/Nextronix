/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationBanner: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full font-sans">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`p-4 rounded-xl shadow-xl flex items-start gap-3 border ${
              notif.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900'
                : notif.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-900'
                : 'bg-indigo-50 dark:bg-indigo-950/90 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {notif.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : notif.type === 'error' ? (
                <AlertTriangle className="h-5 w-5 text-rose-500" />
              ) : (
                <Info className="h-5 w-5 text-indigo-500" />
              )}
            </div>

            <div className="flex-1 text-xs font-medium leading-relaxed">
              {notif.message}
            </div>

            <button
              onClick={() => removeNotification(notif.id)}
              className="shrink-0 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default NotificationBanner;

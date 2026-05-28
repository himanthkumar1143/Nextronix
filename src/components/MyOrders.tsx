import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  ChevronRight, 
  MapPin, 
  AlertCircle,
  Package,
  History,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Order, OrderItem } from '../types';

export const MyOrders: React.FC = () => {
  const { fetchMyOrders, setPage, addNotification } = useApp();
  const [contact, setContact] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      addNotification('Please enter a valid email or phone number', 'error');
      return;
    }
    setSearching(true);
    const results = await fetchMyOrders(contact.trim());
    setSearching(false);
    setHasSearched(true);
    setOrders(results);
    if (results.length === 0) {
      addNotification('No orders found for this contact information', 'info');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500';
      case 'Cancelled': return 'bg-rose-500';
      case 'Delayed': return 'bg-amber-500';
      default: return 'bg-slate-900 dark:bg-emerald-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 font-sans space-y-12">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-black uppercase tracking-widest"
        >
          <History className="h-4 w-4" /> Personal Order Repository
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">My Order History</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Retrieve all historical hardware deployments associated with your contact credentials.
          </p>
        </div>

        <form onSubmit={handleFetch} className="max-w-md mx-auto relative group">
          <input 
            type="text" 
            placeholder="Email or Phone Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full pl-6 pr-32 py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-bold"
          />
          <button 
            type="submit"
            disabled={searching}
            className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 dark:bg-emerald-600 hover:scale-[1.02] active:scale-95 text-white font-black rounded-2xl flex items-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
          >
            {searching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Clock className="h-4 w-4" /></motion.div> : <Search className="h-4 w-4" />}
            <span className="hidden sm:inline tracking-tight">FETCH</span>
          </button>
        </form>
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4 pt-12"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-300">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Credential Entry Required</p>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 space-y-6 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800"
            >
              <AlertCircle className="h-12 w-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">No History Found</h3>
                <p className="text-slate-500 text-sm">We couldn't locate any orders for: <b>{contact}</b></p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-end px-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Found {orders.length} Records</p>
                <button onClick={() => {setHasSearched(false); setOrders([]);}} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Clear Search</button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all"
                  >
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{order.id}</span>
                          <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest text-white ${getStatusColor(order.status)} shadow-lg shadow-emerald-500/10`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                          <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {order.shippingAddress.city}, {order.shippingAddress.country}</span>
                          <span className="flex items-center gap-2 font-black text-emerald-600 truncate">{order.userName} · {order.userEmail}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full sm:justify-end gap-4 sm:gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Deployment Budget</p>
                          <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right sm:hidden">
                          <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => setPage('track-orders')}
                          title="Track Order"
                          className="p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20">
                      <div className="space-y-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-4">
                              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                              <div>
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Qty: {item.quantity} | Unit: ₹{item.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default MyOrders;

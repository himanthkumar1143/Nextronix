import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Clock, 
  AlertCircle,
  Box,
  ShoppingBag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Order } from '../types';

export const TrackOrders: React.FC = () => {
  const { trackOrder, addNotification } = useApp();
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [trackingData, setTrackingData] = useState<Order | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleReset = () => {
    setOrderId('');
    setContact('');
    setTrackingData(null);
    setHasSearched(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderId.trim().toUpperCase();
    const cleanContact = contact.trim();
    
    if (!cleanId || !cleanContact) {
      addNotification('Please enter both Order ID and Contact detail', 'error');
      return;
    }
    setSearching(true);
    const result = await trackOrder(cleanId, cleanContact);
    setSearching(false);
    setHasSearched(true);
    if (!result) {
      setTrackingData(null);
    } else {
      setTrackingData(result);
    }
  };

  const statuses = [
    'Order Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStatusIndex = trackingData ? statuses.indexOf(trackingData.status) : -1;
  const isDelayed = trackingData?.status === 'Delayed';
  const isCancelled = trackingData?.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 font-sans space-y-12">
      
      {/* Search Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-black uppercase tracking-widest"
        >
          <Truck className="h-4 w-4" /> Logistics Tracking System
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Track Your Package</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Insert your unique order ID and contact email or phone to monitor real-time displacement.
          </p>
        </div>

        <form onSubmit={handleTrack} className="max-w-xl mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Order ID (e.g. ORD12345)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-6 pr-6 py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-bold"
            />
            <input 
              type="text" 
              placeholder="Email or Phone Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full pl-6 pr-6 py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-900 dark:text-white font-bold"
            />
          </div>
          <button 
            type="submit"
            disabled={searching}
            className="w-full py-5 bg-slate-900 dark:bg-emerald-600 hover:scale-[1.01] active:scale-95 text-white font-black rounded-3xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer shadow-xl shadow-emerald-500/10"
          >
            {searching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Clock className="h-4 w-4" /></motion.div> : <Search className="h-4 w-4" />}
            <span className="tracking-widest uppercase text-xs">INITIATE TRACKING</span>
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="min-h-[400px] relative">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-4 pt-12"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-300">
                <Box className="h-10 w-10" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting Coordination Entry</p>
            </motion.div>
          ) : !trackingData ? (
            <motion.div 
              key="notfound"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6 pt-12 py-12 bg-rose-500/5 border border-rose-500/10 rounded-3xl"
            >
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full">
                <AlertCircle className="h-10 w-10" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 uppercase">Coordinate Not Found</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">The Order ID provided does not match any current logistics records.</p>
              </div>
              <button onClick={handleReset} className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors underline underline-offset-4">Reset Search</button>
            </motion.div>
          ) : (
            <motion.div 
              key="found"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Order Info Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Live Tracking Active</span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase leading-none truncate max-w-[200px]" title={trackingData.id}>
                      {trackingData.id}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                       <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg"><Clock className="h-4 w-4" /></div>
                       <div className="text-xs">
                         <p className="text-slate-400 font-bold uppercase tracking-widest">Ordered On</p>
                         <p className="text-slate-900 dark:text-white font-black">{new Date(trackingData.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg"><MapPin className="h-4 w-4" /></div>
                       <div className="text-xs">
                         <p className="text-slate-400 font-bold uppercase tracking-widest">Destination</p>
                         <p className="text-slate-900 dark:text-white font-black">{trackingData.shippingAddress.city}, {trackingData.shippingAddress.country}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg"><Clock className="h-4 w-4" /></div>
                       <div className="text-xs">
                         <p className="text-slate-400 font-bold uppercase tracking-widest">Recipient</p>
                         <p className="text-slate-900 dark:text-white font-black">{trackingData.userName} · {trackingData.userEmail}</p>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <div className={`px-6 py-3 rounded-2xl font-black text-lg uppercase tracking-tight ${
                    isCancelled ? 'bg-rose-500 text-white' : 
                    isDelayed ? 'bg-amber-500 text-white' : 
                    trackingData.status === 'Delivered' ? 'bg-emerald-600 text-white' : 
                    'bg-slate-900 text-white dark:bg-emerald-500'
                  }`}>
                    {trackingData.status}
                  </div>
                  {isDelayed && (
                    <p className="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Logistics anomaly detected
                    </p>
                  )}
                </div>
              </div>

              {/* Stepper UI */}
              <div className="py-12 px-2 overflow-x-auto">
                <div className="relative min-w-[600px] flex justify-between items-center px-8">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
                  <div 
                    className="absolute top-1/2 left-8 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-1000"
                    style={{ width: `${Math.max(0, (currentStatusIndex / (statuses.length - 1)) * 100)}%` }}
                  ></div>

                  {statuses.map((step, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    const Icon = idx === 0 ? ShoppingBag : idx === 1 ? Package : idx === 2 ? Truck : idx === 3 ? MapPin : CheckCircle2;

                    let stepColor = 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-300';
                    if (isCompleted) {
                      if (isCancelled) stepColor = 'bg-rose-500 text-white scale-110';
                      else if (isDelayed && isActive) stepColor = 'bg-amber-500 text-white scale-110 ring-4 ring-amber-500/30';
                      else stepColor = 'bg-emerald-600 text-white scale-110';
                    }

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${stepColor} ${isActive && !isDelayed && !isCancelled ? 'ring-4 ring-emerald-500/30' : ''}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-center absolute top-16 w-32 left-1/2 -translate-x-1/2">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step}
                          </p>
                          {isActive && (
                            <p className={`text-[8px] font-bold uppercase mt-0.5 animate-pulse ${isDelayed ? 'text-amber-500' : isCancelled ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {isDelayed ? 'Delayed Phase' : isCancelled ? 'Deployment Terminated' : 'Current Phase'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Summary Table */}
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 pt-20">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Shipment Payload Manifest
                </h3>
                <div className="space-y-4">
                  {trackingData.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between py-4 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shrink-0">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{item.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">${item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between items-center font-black">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Total Valuation</span>
                    <span className="text-xl text-emerald-600 dark:text-emerald-400">${trackingData.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-900 flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none">Security Verified Logistics</h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold leading-none">This shipment is protected by 256-bit encrypted transit protocols</p>
                  </div>
                  <button onClick={handleReset} className="ml-auto text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-1">
                    NEW SEARCH <ArrowRight className="h-3 w-3" />
                  </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
export default TrackOrders;

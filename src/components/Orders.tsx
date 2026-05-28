/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Box, 
  MapPin, 
  ChevronRight, 
  Calendar, 
  Tag, 
  CheckCircle,
  Clock,
  Truck,
  PackageCheck
} from 'lucide-react';

export const Orders: React.FC = () => {
  const { orders, setPage } = useApp();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-amber-500 animate-spin-slow" />;
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'Shipped':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'Delivered':
        return <PackageCheck className="h-4 w-4 text-emerald-600" />;
      default:
        return <Box className="h-4 w-4 text-slate-500" />;
    }
  };

  const statusProgressValue = (status: string) => {
    switch (status) {
      case 'Pending': return 10;
      case 'Paid': return 35;
      case 'Shipped': return 70;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center font-sans max-w-sm mx-auto space-y-6 px-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-slate-400 border border-slate-100 dark:border-slate-800">
          <Box className="h-10 w-10 text-slate-400" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">No Orders Registered</h2>
          <p className="text-xs text-slate-500 pb-2 mt-1 leading-normal">You have not finalized any transaction protocols on this ledger yet. Try simulated checkout!</p>
        </div>
        <button
          onClick={() => setPage('products')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          Explore Gadgets Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 font-sans px-4 sm:px-6 lg:px-0">
      
      <div className="my-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Your Transaction Log</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Review live delivery progress timelines and past purchase receipts.</p>
      </div>

      <div className="space-y-8">
        {orders.map((ord) => {
          const progressPercent = statusProgressValue(ord.status);
          return (
            <div 
              key={ord.id}
              className="bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm"
            >
              
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150 dark:border-slate-800/80 text-xs">
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block font-bold leading-none">ORDER REFERENCE</span>
                    <span className="font-mono font-extrabold text-slate-900 dark:text-slate-200">{ord.id}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block font-bold leading-none">TIMELOG</span>
                    <span className="font-sans font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-emerald-500" /> {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block font-bold leading-none">TOTAL SETTLED</span>
                    <span className="font-mono font-black text-emerald-500">${ord.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="sm:text-right flex items-center sm:justify-end gap-1.5 font-bold leading-none">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-850">
                    {getStatusIcon(ord.status)}
                    <span className={`text-[10px] uppercase font-mono ${ord.status === 'Cancelled' ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {ord.status}
                    </span>
                  </div>
                </div>

              </div>

              {/* Items row & map coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Item products breakdown table */}
                <div className="md:col-span-2 space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Invoiced Systems ({ord.items.length})</span>
                  <div className="space-y-3 shrink-0">
                    {ord.items.map((item) => (
                      <div key={item.productId} className="flex gap-4 items-center justify-between text-xs font-semibold">
                        <div className="flex gap-3 items-center">
                          <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded-lg border dark:border-slate-800 bg-slate-50" />
                          <div className="space-y-0.5 leading-tight">
                            <h4 className="text-slate-900 dark:text-slate-200 line-clamp-1 max-w-[150px] sm:max-w-xs">{item.name}</h4>
                            <span className="text-slate-400 block font-mono">Q_Qty: {item.quantity} units</span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-900 dark:text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Coordinates box */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-105 dark:border-slate-850 rounded-xl space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-500" /> Dispense Coordinates
                  </span>
                  <div className="leading-relaxed font-sans font-medium text-slate-700 dark:text-slate-350">
                    <p className="font-extrabold text-slate-900 dark:text-slate-200">{ord.shippingAddress.fullName}</p>
                    <p>{ord.shippingAddress.address}</p>
                    <p>{ord.shippingAddress.city}, {ord.shippingAddress.postalCode}</p>
                    <p>{ord.shippingAddress.country}</p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block pt-1.5 border-t border-slate-200 dark:border-slate-800">Carrier: {ord.paymentMethod}</span>
                </div>

              </div>

              {/* TIMELINE PROGRESS SCALE GRAPHIC BAR */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase leading-none">
                  <span>Dispensation Progress bar</span>
                  <span className="font-mono text-emerald-500">{ord.status} ({progressPercent}%)</span>
                </div>
                
                {/* Horizontal progress scale */}
                <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-805 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full transition-all duration-500 hover:brightness-110 shadow shadow-emerald-500/10" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {/* Timeline indicators labels */}
                <div className="grid grid-cols-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center leading-none">
                  <span className={progressPercent >= 10 ? 'text-emerald-500' : ''}>Processed</span>
                  <span className={progressPercent >= 35 ? 'text-emerald-500' : ''}>Paid</span>
                  <span className={progressPercent >= 70 ? 'text-blue-500' : ''}>Transit</span>
                  <span className={progressPercent >= 100 ? 'text-emerald-600' : ''}>Delivered</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
export default Orders;

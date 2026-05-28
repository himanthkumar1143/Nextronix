/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft 
} from 'lucide-react';

export const Wishlist: React.FC = () => {
  const { 
    wishlist, 
    products, 
    toggleWishlist, 
    addToCart, 
    setPage, 
    selectProduct 
  } = useApp();

  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedItems.length === 0) {
    return (
      <div className="py-20 text-center font-sans max-w-md mx-auto space-y-6 px-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-slate-400 border border-slate-100 dark:border-slate-800">
          <Heart className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 leading-normal mb-2">You have not marked any technical hardware modules for active monitoring yet.</p>
        </div>
        <button
          onClick={() => setPage('products')}
          className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 font-sans px-4 sm:px-6 lg:px-0">
      
      <div className="my-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Your Monitored Hardware</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Review items you bookmarked for tracking and load them straight to your workstation design.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistedItems.map((p) => (
          <div 
            key={p.id}
            className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-80/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual box */}
            <div className="relative aspect-square bg-slate-50 dark:bg-slate-800 overflow-hidden select-none">
              <img 
                src={p.imageUrl} 
                alt={p.name} 
                className="w-full h-full object-cover group-hover:scale-102 duration-300 cursor-pointer"
                onClick={() => selectProduct(p.id)}
              />
              <button
                onClick={() => toggleWishlist(p.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white dark:bg-slate-900 shadow border border-slate-150 dark:border-slate-800 text-rose-500 hover:text-rose-600 cursor-pointer"
                title="Remove bookmarks"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Info and action */}
            <div className="p-4 space-y-3">
              <span className="text-[10px] font-mono font-bold text-emerald-500 block uppercase">{p.category}</span>
              <h3 
                onClick={() => selectProduct(p.id)}
                className="text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer line-clamp-1 hover:text-emerald-555 transition-colors"
              >
                {p.name}
              </h3>
              
              <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-800/80">
                <span className="text-sm font-black text-slate-900 dark:text-slate-100 font-mono">${p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  disabled={p.stock === 0}
                  className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> add
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
export default Wishlist;

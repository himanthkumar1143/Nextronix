/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Heart, 
  ChevronLeft, 
  Truck, 
  RotateCcw, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    setPage, 
    addToCart, 
    toggleWishlist, 
    wishlist,
    selectProduct,
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'description' | 'warranty'>('description');
  
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Scroll to top quando product ID changes
  useEffect(() => {
    setActiveImageIdx(0);
    setPurchaseQuantity(1);
  }, [selectedProductId]);

  if (!selectedProduct) {
    return (
      <div className="p-16 text-center font-sans space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Product Not Located</h3>
        <p className="text-sm text-slate-500">The requested technical hardware was not registered in active laboratory database.</p>
        <button 
          onClick={() => setPage('products')}
          className="px-5 py-2.5 bg-emerald-500 text-white font-semibold text-xs rounded-lg cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Related products query (excluding active item, matching category)
  const related = products
    .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  const imagesList = selectedProduct.images || [selectedProduct.imageUrl];
  const hasInWishList = wishlist.includes(selectedProduct.id);

  return (
    <div className="pb-24 font-sans px-4 sm:px-6 lg:px-0">
      
      {/* Back button shortcut */}
      <button 
        onClick={() => setPage('products')}
        className="my-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-500 transition-all cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" /> Back to store listing
      </button>

      {/* Main detail columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery and Slider thumbnails */}
        <div className="space-y-4">
          
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <img 
              src={imagesList[activeImageIdx]} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            
            {selectedProduct.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white bg-emerald-500 dark:bg-emerald-600 rounded-full uppercase tracking-wider shadow-sm">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* Sub thumbnails selection */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 select-none leading-none">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 aspect-square rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-emerald-500 shadow-md scale-95' : 'border-slate-100 dark:border-slate-800'
                  }`}
                  title={`View thumbnail ${idx + 1}`}
                >
                  <img src={imgUrl} alt="Sub thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Descriptions & Actions */}
        <div className="space-y-6">
          
          {/* Header block */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest block">{selectedProduct.category} Department</span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {selectedProduct.name}
            </h1>
          </div>

          {/* Pricing wrapper */}
          <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block tracking-wider font-bold">RETAIL PRICING</span>
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">₹{selectedProduct.price}</span>
            </div>
            
            <div className="text-right text-xs">
              <span className="text-slate-400 block">Inventory Status</span>
              {selectedProduct.stock > 0 ? (
                <span className="font-bold text-emerald-500 flex items-center justify-end gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  {selectedProduct.stock} units ready
                </span>
              ) : (
                <span className="font-bold text-rose-500 uppercase">Awaiting Re-batching</span>
              )}
            </div>
          </div>

          {/* Quantity selector and Cart controls */}
          {selectedProduct.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              
              {/* Quantities adjusted bar */}
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setPurchaseQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 font-bold transition-all text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-950/20 font-mono">
                  {purchaseQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setPurchaseQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                  className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 font-bold transition-all text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add trigger */}
              <button
                onClick={() => addToCart(selectedProduct, purchaseQuantity)}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 duration-100 transition-all cursor-pointer hover:shadow-xl active:scale-98"
              >
                <ShoppingBag className="h-4 w-4" /> Add selected units
              </button>

              {/* Wishlist toggle buttons */}
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center text-sm transition-all cursor-pointer ${
                  hasInWishList
                    ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>

            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-center text-xs rounded-xl font-mono">
              Temporarily Sold out. Please subscribe in active newsletters below to receive restocking notifications.
            </div>
          )}

          {/* Quick core metrics indicators */}
          <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex gap-2.5 items-center">
              <Truck className="h-4.5 w-4.5 text-emerald-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Immediate Dispense</span>
                <span className="text-slate-400">Shipped with tracking code in 12h</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <Award className="h-4.5 w-4.5 text-emerald-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Verified Authentic</span>
                <span className="text-slate-400">100% original manufacturer package</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Structured Details Specs Tab sheets */}
      <section className="mt-16 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8">
        
        {/* Navigation row */}
        <div className="flex border-b border-slate-250 dark:border-slate-800 pb-3 gap-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 leading-none overflow-x-auto">
          <button
            onClick={() => setActiveDetailsTab('description')}
            className={` transition-all relative py-1 cursor-pointer whitespace-nowrap ${activeDetailsTab === 'description' ? 'text-emerald-500 font-extrabold' : 'hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            Product Description
            {activeDetailsTab === 'description' && <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-emerald-500 rounded"></span>}
          </button>
          <button
            onClick={() => setActiveDetailsTab('warranty')}
            className={` transition-all relative py-1 cursor-pointer whitespace-nowrap ${activeDetailsTab === 'warranty' ? 'text-emerald-500 font-extrabold' : 'hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            Labor Warranty
            {activeDetailsTab === 'warranty' && <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-emerald-500 rounded"></span>}
          </button>
        </div>

        {/* Dynamic sheet */}
        <div className="pt-6 font-sans text-sm min-h-[150px]">
          {activeDetailsTab === 'description' && (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {selectedProduct.description}
            </p>
          )}

          {activeDetailsTab === 'warranty' && (
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              <p>
                Each technical gadget dispatched by Nextronix Hardware Labs travels backed by an immersive <strong>24-Month component warranty</strong>. This includes coverage against circuit decay, micro-acoustic transducer malfunctions, linear key spring stress failures, and health sensor optical drift.
              </p>
              <ul className="space-y-1 text-xs text-slate-400 font-mono">
                <li>• Covers 100% labor and electronic parts</li>
                <li>• Direct pickup from shipping locations if repair is validated</li>
                <li>• Dynamic tech helpline lookup to analyze bug logs before components ship</li>
              </ul>
            </div>
          )}
        </div>

      </section>

      {/* Recommendation carousel */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">System Related Hardware</h2>
            <p className="text-xs text-slate-500 mt-1">Deploy additional technical components built in the same category alignment.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
               <div 
                 key={p.id}
                 onClick={() => selectProduct(p.id)}
                 className="group bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
               >
                 <div className="aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900 select-none">
                   <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 duration-300" />
                 </div>
                 <div className="p-4 space-y-1 text-center">
                   <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase">{p.category}</span>
                   <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">{p.name}</h4>
                   <p className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono">₹{p.price}</p>
                 </div>
               </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
export default ProductDetails;

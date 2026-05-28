/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Undo2, 
  Check, 
  X,
  Lock
} from 'lucide-react';

export const Cart: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    setPage, 
    user,
    addNotification
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [activeDiscountCode, setActiveDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Apply Coupon Code
  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBox = couponInput.toUpperCase().trim();
    if (cleanBox === 'NEXTRONIX20') {
      setActiveDiscountCode('NEXTRONIX20');
      setDiscountPercent(20);
      addNotification('Success: 20% discount applied to active components!', 'success');
    } else if (cleanBox === 'GADGET10') {
      setActiveDiscountCode('GADGET10');
      setDiscountPercent(10);
      addNotification('Success: 10% discount applied to your checkout cart!', 'success');
    } else {
      addNotification('Invalid or expired promotional code', 'error');
    }
    setCouponInput('');
  };

  const removeDiscount = () => {
    setActiveDiscountCode(null);
    setDiscountPercent(0);
    addNotification('Coupon removed', 'info');
  };

  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const estimateTax = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
  const totalCost = Number((subtotal - discountAmount + shippingFee + estimateTax).toFixed(2));

  const proceedToCheckout = () => {
    // Save discount info to sessionStorage or pass gracefully
    sessionStorage.setItem('nextronix_discount_code', activeDiscountCode || '');
    sessionStorage.setItem('nextronix_discount_percent', String(discountPercent));
    setPage('checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center font-sans max-w-md mx-auto space-y-6 px-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-slate-400 border border-slate-100 dark:border-slate-800">
          <ShoppingBag className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 pb-1.5">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 leading-normal">You have not queued any high-spec tech gadgets in your workstation clipboard. Check our latest releases!</p>
        </div>

        <button
          onClick={() => { setPage('products'); }}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 font-bold text-xs rounded-xl text-white inline-flex items-center gap-2 transition cursor-pointer shadow-md"
        >
          <Undo2 className="h-4 w-4" /> Browse Laboratory Store
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 font-sans px-4 sm:px-6 lg:px-0">
      
      <div className="my-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Shopping Workstation Cart</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Review your queued technical assets and complete secure payment checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Listing column */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item.productId}
              className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm"
            >
              <div className="flex gap-4 items-center">
                {/* Product image widget */}
                <div className="w-20 aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 dark:border-slate-850 shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Meta details */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-slate-500 font-mono font-medium">₹{item.price} each</p>
                  <p className="text-[10px] text-slate-400 font-mono">Max limit: {item.stock} in stock</p>
                </div>
              </div>

              {/* Adjust qty and totals */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-none border-slate-100">
                
                {/* Adjuster keypad */}
                <div className="flex items-center border border-slate-200 dark:border-slate-850 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition text-xs cursor-pointer select-none"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition text-xs cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400 font-mono font-medium">Subtotal</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                  title="Remove asset"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>

              </div>
            </div>
          ))}

          {/* Quick Back link */}
          <button 
            onClick={() => setPage('products')}
            className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
          >
            ← Add more tech hardware to setup
          </button>
        </div>

        {/* WORKSTATION SUMMARY CARD */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-6 lg:sticky lg:top-24">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800">
            Order Sheet Summary
          </h3>

          {/* Voucher input form */}
          {activeDiscountCode ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-between text-xs">
              <span className="font-mono font-extrabold flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" /> Code: {activeDiscountCode} (-{discountPercent}%)
              </span>
              <button 
                onClick={removeDiscount} 
                className="p-1 hover:bg-emerald-500/20 rounded cursor-pointer"
                title="Remove Coupon"
              >
                <X className="h-3.5 w-3.5 text-emerald-600" />
              </button>
            </div>
          ) : (
            <form onSubmit={applyCoupon} className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Promo Coupon Vouchers</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="NEXTRONIX20 / GADGET10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button 
                  type="submit"
                  className="px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer border border-transparent"
                >
                  Verify
                </button>
              </div>
            </form>
          )}

          {/* Pricing breakdowns */}
          <div className="space-y-3 pt-2 text-xs font-medium border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Items Subtotal</span>
              <span className="text-slate-900 dark:text-slate-100 font-mono">₹{subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-500 font-semibold">
                <span>Special Voucher Discount (-{discountPercent}%)</span>
                <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-400">Courier Shipping Courier</span>
              <span className="text-slate-900 dark:text-slate-100 font-mono">
                {shippingFee === 0 ? 'FREE Shippings' : `₹${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Labs Tax (8%)</span>
              <span className="text-slate-900 dark:text-slate-100 font-mono">₹{estimateTax.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-slate-250 dark:border-slate-800 flex justify-between items-end">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Projected Total Amount</span>
              <span className="text-xl font-black text-emerald-500 font-mono">₹{totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Proceed Trigger */}
          <button
            onClick={proceedToCheckout}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:shadow-xl transition-all cursor-pointer active:scale-98"
          >
            Secure Checkout Form
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Micro transport indicator */}
          <p className="text-[10px] text-center text-slate-400 leading-normal font-sans">
            Secure full-stack connection active. Free Global high-flex courier automatically applies to orders exceeding ₹150.
          </p>

        </div>

      </div>

    </div>
  );
};
export default Cart;

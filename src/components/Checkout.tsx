import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  ChevronRight, 
  ShoppingBag,
  Mail,
  User as UserIcon,
  Copy,
  Check
} from 'lucide-react';
import { ShippingAddress, Order } from '../types';

export const Checkout: React.FC = () => {
  const { 
    cart, 
    submitOrder, 
    setPage, 
    addNotification
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);

  // Guest Details
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  // Shipping Form Fields
  const [shippingForm, setShippingForm] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phoneNumber: ''
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addNotification('Tracking ID copied to clipboard', 'info');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCost = subtotal + (subtotal > 150 ? 0 : 15);

  useEffect(() => {
    if (cart.length === 0 && checkoutStep !== 3) setPage('cart');
  }, [cart, checkoutStep]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const validateShipping = () => {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phoneNumber) {
      addNotification('Identification coordinates are required.', 'error');
      return false;
    }
    const { address, city, state, pincode, country } = shippingForm;
    if (!address || !city || !state || !pincode || !country) {
      addNotification('Incomplete logistics destination data.', 'error');
      return false;
    }
    return true;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setCardDetails(prev => ({ ...prev, name: guestInfo.name.toUpperCase() }));
      setCheckoutStep(2);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingState('Initiating secure gateway connection...');

    const statuses = ['Establishing SSL connection...', 'Encrypting payload...', 'Authorizing ledger...', 'Finalizing logs...'];
    for (const s of statuses) {
      await new Promise(res => setTimeout(res, 500));
      setProcessingState(s);
    }

    try {
      const order = await submitOrder({
        name: guestInfo.name,
        email: guestInfo.email,
        phoneNumber: guestInfo.phoneNumber,
        address: { ...shippingForm, fullName: guestInfo.name, phoneNumber: guestInfo.phoneNumber },
        paymentMethod: `Stripe Visa (ending in ${cardDetails.number.slice(-4)})`
      });
      if (order) {
        setCreatedOrder(order);
        setCheckoutStep(3);
      }
    } catch (err: any) {
      addNotification(`Gateway processing failed: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pb-24 font-sans max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      
      {/* Stepper indicator */}
      <div className="my-10 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 select-none">
        <span className={`flex items-center gap-1.5 ${checkoutStep >= 1 ? 'text-emerald-500' : ''}`}>
          <MapPin className="h-4 w-4" /> Logistics
        </span>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className={`flex items-center gap-1.5 ${checkoutStep >= 2 ? 'text-emerald-500' : ''}`}>
          <CreditCard className="h-4 w-4" /> Payment
        </span>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className={`flex items-center gap-1.5 ${checkoutStep === 3 ? 'text-emerald-500' : ''}`}>
          <CheckCircle2 className="h-4 w-4" /> Result
        </span>
      </div>

      {checkoutStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleShippingSubmit} className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-emerald-500" /> Identification
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                   <input required value={guestInfo.name} onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold" placeholder="e.g. John Matrix" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Node</label>
                   <input required type="email" value={guestInfo.email} onChange={e => setGuestInfo({...guestInfo, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold" placeholder="john@nextronix.com" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Protocol</label>
                   <input required type="tel" value={guestInfo.phoneNumber} maxLength={10} minLength={10} onChange={e => {
                     const val = e.target.value.replace(/\D/g, '').substring(0, 10);
                     setGuestInfo({...guestInfo, phoneNumber: val});
                     setShippingForm({...shippingForm, phoneNumber: val});
                   }} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold" placeholder="e.g. 9876543210" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <MapPin className="h-6 w-6 text-emerald-500" /> Logistics Destination
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                   <input required value={shippingForm.address} onChange={e => setShippingForm({...shippingForm, address: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <input required value={shippingForm.city} onChange={e => setShippingForm({...shippingForm, city: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State / Province</label>
                    <input required value={shippingForm.state} onChange={e => setShippingForm({...shippingForm, state: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode / Zip</label>
                    <input required value={shippingForm.pincode} onChange={e => setShippingForm({...shippingForm, pincode: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold uppercase tracking-widest font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                    <input required value={shippingForm.country} onChange={e => setShippingForm({...shippingForm, country: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/10">
              Set Payment Method <ChevronRight className="h-4 w-4 inline ml-2" />
            </button>
          </form>

          <aside className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] h-fit sticky top-24">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Payload Summary</h3>
             <div className="space-y-4 mb-8 max-h-60 overflow-y-auto">
               {cart.map(item => (
                 <div key={item.productId} className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-none">{item.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">UNIT x{item.quantity}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white tabular-nums">₹{(item.price * item.quantity).toLocaleString()}</span>
                 </div>
               ))}
             </div>
             <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Logistics Fee</span>
                  <span>{subtotal > 150 ? 'FREE' : '₹15'}</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                   <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Settlement Total</span>
                   <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">₹{totalCost.toLocaleString()}</span>
                </div>
             </div>
          </aside>
        </div>
      )}

      {checkoutStep === 2 && (
        <div className="max-w-md mx-auto space-y-8">
           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 rotate-12 group-hover:scale-110 transition-transform">
                <CreditCard className="h-40 w-40" />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-48">
                 <div className="flex justify-between">
                    <div className="w-12 h-9 bg-amber-500/20 rounded-lg border border-amber-500/30"></div>
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Nextronix Secure</span>
                 </div>
                 <p className="text-xl font-black tracking-widest text-center my-4 font-mono">{cardDetails.number || '•••• •••• •••• ••••'}</p>
                 <div className="flex justify-between items-end">
                    <div className="max-w-[200px] truncate">
                       <p className="text-[8px] font-black opacity-30 uppercase mb-1">Holder</p>
                       <p className="text-xs font-black uppercase tracking-widest leading-none">{cardDetails.name || 'GUEST CUSTOMER'}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black opacity-30 uppercase mb-1">Expiry</p>
                       <p className="text-xs font-black uppercase tracking-widest leading-none">{cardDetails.expiry || '••/••'}</p>
                    </div>
                 </div>
              </div>
           </div>

           <form onSubmit={handlePaymentSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
             {isProcessing ? (
               <div className="p-12 text-center space-y-6">
                 <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mx-auto" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">{processingState}</p>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Digits</label>
                    <input required value={cardDetails.number} onChange={handleCardNumberChange} placeholder="4111 2222 3333 4444" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-mono text-center font-bold" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiration</label>
                        <input required value={cardDetails.expiry} onChange={e => {
                           let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                           if (val.length > 2) {
                             val = val.substring(0, 2) + '/' + val.substring(2);
                           }
                           setCardDetails({...cardDetails, expiry: val})
                         }} placeholder="MM/YY" maxLength={5} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-center font-black font-mono tracking-widest" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV Signature</label>
                        <input required value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})} placeholder="•••" type="password" maxLength={3} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-center font-black tracking-widest" />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/10">Authorize ₹{totalCost.toLocaleString()}</button>
                 <button type="button" onClick={() => setCheckoutStep(1)} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all cursor-pointer">← Modify Logistics</button>
               </div>
             )}
           </form>
        </div>
      )}

      {checkoutStep === 3 && createdOrder && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 rounded-[3.5rem] shadow-2xl text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-emerald-500 rounded-full"></div>
          
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-4">
             <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Deployment Complete</h2>
             
             <div className="pt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tracking Identifier</p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl group transition-all hover:border-emerald-500/40">
                   <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider select-all">{createdOrder.id}</span>
                   <button 
                     onClick={() => copyId(createdOrder.id)}
                     className="p-2 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer text-emerald-500"
                     title="Copy ID"
                   >
                     {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                   </button>
                </div>
             </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-left space-y-6">
             <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-4">Payload Summary</p>
                {createdOrder.items.map(item => (
                  <div key={item.productId} className="flex justify-between text-xs font-black uppercase font-mono">
                     <span className="text-slate-500">{item.name} x{item.quantity}</span>
                     <span className="text-slate-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
             </div>
             <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Settled Total</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">₹{createdOrder.totalAmount.toLocaleString()}</div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <button onClick={() => setPage('track-orders')} className="flex-1 py-5 bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-900/10 cursor-pointer">Track Deliveries</button>
             <button onClick={() => setPage('products')} className="flex-1 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">System Catalog</button>
          </div>
          
          <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">Protocol proof of transaction synchronized and sealed.</p>
        </div>
      )}

    </div>
  );
};
export default Checkout;

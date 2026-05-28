import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Heart, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    isAdmin,
    cart, 
    wishlist, 
    theme, 
    toggleTheme, 
    currentPage, 
    setPage, 
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'Shop', page: 'products' },
    { name: 'My Orders', page: 'my-orders' },
    { name: 'Track Orders', page: 'track-orders' },
    { name: 'Contact', page: 'contact' },
    { name: 'Admin', page: 'admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and Icon */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 duration-100">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-none uppercase">
                NEXTRONIX
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] mt-0.5">PREMIUM TECH</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setPage(item.page as any)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Icons Bar */}
          <div className="hidden md:flex items-center gap-3">
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            <button 
              onClick={() => setPage('wishlist')}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative cursor-pointer"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setPage('cart')}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative cursor-pointer"
              title="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {isAdmin && (
              <div className="flex items-center gap-2 ml-2 pl-4 border-l border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setPage('admin')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5" /> Dashboard
                </button>
                <button 
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}

          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <button 
              onClick={() => setPage('cart')}
              className="p-2 rounded-xl text-slate-500 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-emerald-600 bg-emerald-500/10"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { setPage(item.page as any); setMobileMenuOpen(false); }}
                className={`py-3 px-4 rounded-xl font-bold text-sm text-left ${
                  currentPage === item.page
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
            <button onClick={toggleTheme} className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />} Theme: {theme}
            </button>
            <button onClick={() => { setPage('wishlist'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-widest">
              <Heart className="h-4 w-4" /> Wishlist ({wishlist.length})
            </button>
          </div>

          {isAdmin && (
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
               <button onClick={() => { setPage('admin'); setMobileMenuOpen(false); }} className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Open Console</button>
               <button onClick={logout} className="text-rose-500 text-xs font-black uppercase tracking-widest">Finalize Session</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
export default Header;

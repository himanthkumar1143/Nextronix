/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  Heart, 
  RotateCcw,
  Grid,
  FilterX
} from 'lucide-react';

export const Products: React.FC = () => {
  const { 
    products, 
    wishlist, 
    addToCart, 
    toggleWishlist, 
    selectProduct,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    priceRange,
    // Add set methods or we filter directly in the UI if we want complete flexibility
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localMaxPrice, setLocalMaxPrice] = useState(10000);
  const [localInStock, setLocalInStock] = useState(false);

  // Available categories in the database
  const categoriesList = ['All', 'Audio', 'Keyboards', 'Wearables', 'Workspace', 'Laptops', 'Displays', 'Console', 'Other'];

  // Apply filters locally in component for dynamic responsiveness or sync to Context
  const filteredProducts = products.filter((p) => {
    // 1. Search filter
    if (localSearch) {
      const q = localSearch.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // 2. Category filter
    if (activeCategory !== 'All' && p.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }

    // 3. Max Price Limit
    if (p.price > localMaxPrice) return false;

    // 4. In Stock only
    if (localInStock && p.stock <= 0) return false;

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts];
  if (sortBy === 'price-asc') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else {
    // defaults newest
    sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const handleReset = () => {
    setLocalSearch('');
    setSearchQuery('');
    setActiveCategory('All');
    setLocalMaxPrice(10000);
    setLocalInStock(false);
    setSortBy('newest');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  return (
    <div className="pb-24 font-sans px-4 sm:px-6 lg:px-0">
      
      {/* Title block */}
      <div className="my-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Technical Hardware Catalog</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Filter and explore responsive tech modules designed to simplify modern workstations.
        </p>
      </div>

      {/* Grid structure: Filters Sidebar + Grid space */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* FILTERS PANEL */}
        <aside className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-6 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
              Adjust Filters
            </span>
            <button 
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 transition-all cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="h-3 w-3" /> Clear
            </button>
          </div>

          {/* Search bar helper */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Query keyword</label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Keycaps, audio..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full text-xs font-sans pl-3 pr-8 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 p-1 text-slate-400 hover:text-emerald-500"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* Categories select list */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Unit Department</label>
            <div className="flex flex-wrap lg:flex-col gap-1.5 leading-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-left text-xs font-medium transition-all duration-100 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-500/10 md:bg-emerald-500 text-emerald-600 md:text-white font-semibold'
                      : 'bg-white dark:bg-slate-950 lg:bg-transparent border border-slate-200 dark:border-slate-800 lg:border-none text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {cat || 'All Hardware'}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price bracket */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Max pricing limit</label>
              <span className="text-xs font-semibold text-emerald-500 font-mono">₹{localMaxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹0</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Double-toggle inventory index */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Stock Only</span>
            <button
              onClick={() => setLocalInStock(!localInStock)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${localInStock ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localInStock ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

        </aside>

        {/* PRODUCTS LIST GRID AREA */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls toolbar */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-4 py-3 rounded-2xl text-xs">
            <span className="font-medium text-slate-500">
              Found <strong className="text-slate-900 dark:text-slate-100">{sortedProducts.length}</strong> system nodes
            </span>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-slate-950 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low - High</option>
                <option value="price-desc">Price: High - Low</option>
              </select>
            </div>
          </div>

          {/* If list is empty */}
          {sortedProducts.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col justify-center items-center gap-4">
              <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                <FilterX className="h-8 w-8 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No Hardware Detected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">No systems matches your active filter parameters. Reset settings to browse our central catalog.</p>
              </div>
              <button 
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-500 hover:scale-95 duration-100 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Reset Department Filters
              </button>
            </div>
          ) : (
            /* Products Grid display */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((p) => {
                const inWish = wishlist.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-80/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/5 dark:hover:border-slate-750 transition-all duration-300 flex flex-col justify-between"
                  >
                    
                    {/* Visual box */}
                    <div className="relative aspect-square bg-slate-50 dark:bg-slate-800 overflow-hidden inline-block h-fit w-full">
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-102 duration-500 select-none cursor-pointer"
                        onClick={() => selectProduct(p.id)}
                      />
                      
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] bg-emerald-500 dark:bg-emerald-600 text-white font-black tracking-wide rounded-full uppercase">
                          {p.badge}
                        </span>
                      )}

                      {p.stock === 0 && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] bg-rose-500 text-white font-black tracking-wide rounded-full uppercaseNDA">
                          Out of Stock
                        </span>
                      )}

                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full border shadow-sm transition-all cursor-pointer ${
                          inWish 
                            ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600' 
                            : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800'
                        }`}
                        title="Toggle wishlist"
                      >
                        <Heart className="h-4 w-4 animate-scale" />
                      </button>
                    </div>

                    {/* Meta info layout */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-emerald-500 block uppercase tracking-wider">{p.category}</span>
                        <h3 
                          onClick={() => selectProduct(p.id)}
                          className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-500 cursor-pointer line-clamp-1 transition-all"
                        >
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/60">
                        <span className="text-base font-black text-slate-900 dark:text-slate-100 font-sans">₹{p.price}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => selectProduct(p.id)}
                            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => addToCart(p)}
                            disabled={p.stock === 0}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:pointer-events-none hover:shadow text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            title="Add item to Shopping Cart"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Add
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
export default Products;

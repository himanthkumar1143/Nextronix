import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  AlertCircle,
  Plus, 
  Search,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users,
  LogOut,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  Filter,
  Menu
} from 'lucide-react';
import { Product, Order, Complaint } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    complaints,
    reviews,
    adminAddProduct, 
    adminUpdateProduct, 
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminDeleteOrder,
    adminFetchComplaints,
    adminUpdateComplaintStatus,
    adminDeleteComplaint,
    refreshOrders,
    refreshProducts,
    fetchAdminStats,
    adminStats,
    logout,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'complaints'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Trigger loading collections on load
  useEffect(() => {
    refreshOrders();
    refreshProducts();
    adminFetchComplaints();
    fetchAdminStats();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
  ];

  // Stats
  const revenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  
  const statItems = [
    { label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', trend: 'LIVE', target: 'orders' },
    { label: 'Orders Processed', value: orders.length, icon: Package, color: 'text-blue-500', trend: `${orders.filter(o => o.status === 'Delivered').length} DELIVERED`, target: 'orders' },
    { label: 'Active Listings', value: products.length, icon: ShoppingBag, color: 'text-amber-500', trend: 'VALIDATED', target: 'products' },
    { label: 'Complaints', value: complaints.filter(c => c.status === 'pending').length, icon: AlertCircle, color: 'text-rose-500', trend: `${complaints.filter(c => c.status === 'pending').length} PENDING`, target: 'complaints' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed inset-y-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-sm uppercase">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Elite Architect</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Finalize Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-8 lg:p-12 min-w-0">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              {activeTab === 'dashboard' && (
                <h2 className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-lg sm:text-xl md:text-2xl mb-2">
                  Welcome back, {user?.name || 'Admin'}
                </h2>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">Administrative Intelligence Module</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeTab === 'products' && (
              <button 
                onClick={() => { setEditingProduct(null); setShowAddModal(true); }}
                className="px-6 py-3 bg-slate-900 dark:bg-emerald-600 hover:scale-105 active:scale-95 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-slate-900/10"
              >
                <Plus className="h-4 w-4" /> Add New Product
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statItems.map((stat, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveTab(stat.target as any)}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <div className="relative z-10 space-y-4">
                      <div className={`p-4 bg-slate-50 dark:bg-slate-800 w-fit rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{stat.value}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 pt-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.trend.includes('LIVE') || stat.trend.includes('VALIDATED') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          {stat.trend}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Metrics</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions Table Row */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recent Logistics logs</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-black text-emerald-500 uppercase tracking-widest hover:underline cursor-pointer">View Registry</button>
                  </div>
                  <div className="space-y-6">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-slate-500 rounded-xl">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white uppercase leading-none">#{order.id.split('-').pop()}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{order.userName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 dark:text-white leading-none">₹{order.totalAmount}</p>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 block">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0 z-0 opacity-40">
                    <img 
                      src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=60" 
                      alt="Branding" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                         NEXTRO<span className="text-emerald-500">NIX</span>
                       </h3>
                       <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full"></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                      Advanced hardware procurement for global laboratory standards.
                    </p>
                    <div className="pt-4">
                       <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-500">
                         Operational Status: Live
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row justify-between gap-4">
                   <div className="relative flex-1 max-w-md">
                     <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                       <Search className="h-4 w-4" />
                     </span>
                     <input type="text" value={adminSearchQuery} onChange={(e) => setAdminSearchQuery(e.target.value)} placeholder="Search catalog manifest..." className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-xs font-bold uppercase transition-all" />
                   </div>
                    <div className="flex gap-2 relative">
                     <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 transition-all"><Filter className="h-4 w-4" /> {filterCategory}</button>
                     {showFilterDropdown && (
                       <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-20 w-40 p-2">
                         {['All', 'Audio', 'Keyboards', 'Wearables', 'Workspace', 'Laptops', 'Displays', 'Console', 'Other'].map(cat => (
                           <button key={cat} onClick={() => { setFilterCategory(cat); setShowFilterDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                             {cat}
                           </button>
                         ))}
                       </div>
                     )}
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] bg-slate-50/30 dark:bg-slate-950/30">
                        <th className="px-8 py-6">Product Manifest</th>
                        <th className="px-8 py-6">Department</th>
                        <th className="px-8 py-6">Price Point</th>
                        <th className="px-8 py-6">Resource Hub</th>
                        <th className="px-8 py-6 text-right">Action Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {products
                        .filter(p => p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || p.description.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                        .filter(p => filterCategory === 'All' || p.category === filterCategory)
                        .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div>
                                <p className="font-black text-slate-900 dark:text-white uppercase leading-none">{p.name}</p>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1.5">{p.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-8 py-6 font-black text-slate-900 dark:text-white tabular-nums">₹{p.price}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500 animate-pulse' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{p.stock} Units In Stock</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditingProduct(p); setShowAddModal(true); }}
                                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500 rounded-xl transition-all cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => adminDeleteProduct(p.id)}
                                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 rounded-xl transition-all cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="grid gap-6">
                {orders.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-24 text-center">
                    <Package className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No logistics logs detected</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col xl:flex-row gap-8">
                       <div className="flex-1 space-y-6">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl uppercase font-black text-xs tracking-tighter">
                              OrderID: {order.id.split('-').pop()}
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 
                              order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-amber-500/10 text-amber-500'
                            }`}>
                              {order.status}
                            </div>
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Recipient</p>
                              <p className="font-black text-slate-900 dark:text-white uppercase text-sm leading-none">{order.userName}</p>
                              <p className="text-[10px] text-slate-500 font-medium truncate">{order.userEmail}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Location</p>
                              <p className="font-black text-slate-900 dark:text-white uppercase text-sm leading-none">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                              <p className="text-[10px] text-slate-500 font-medium truncate">{order.shippingAddress.address}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Items Quantity</p>
                              <p className="font-black text-slate-900 dark:text-white uppercase text-sm leading-none">{order.items.reduce((a, b) => a + b.quantity, 0)} Units</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Amount</p>
                              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none tabular-nums">₹{order.totalAmount}</p>
                            </div>
                          </div>
                       </div>

                       <div className="xl:w-80 flex flex-col gap-4 justify-between border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800 pt-8 xl:pt-0 xl:pl-8">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phase Adjustment</label>
                            <select 
                              value={order.status}
                              onChange={(e) => adminUpdateOrderStatus(order.id, e.target.value as any)}
                              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="Order Confirmed">Order Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Delayed">Delayed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                          <div className="flex gap-2 mt-auto">
                             <button onClick={() => adminDeleteOrder(order.id)} className="flex-1 py-4 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer">Delete Order</button>
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'complaints' && (
            <motion.div 
              key="complaints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                {complaints.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-24 text-center">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500/20 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No anomalies identified in sector</p>
                  </div>
                ) : (
                  complaints.map((comp) => (
                    <div key={comp.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 group hover:border-rose-500/30 transition-all shadow-sm">
                       <div className="flex flex-col md:flex-row justify-between gap-8">
                          <div className="space-y-4 flex-1">
                             <div className="flex items-center gap-3">
                               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${comp.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
                                 {comp.status}
                               </div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">COM-{comp.id.split('-').pop()}</span>
                             </div>
                             <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-snug">
                               {comp.message}
                             </h4>
                             <div className="flex flex-wrap gap-6 pt-4">
                                <div className="flex items-center gap-2">
                                   <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl"><Users className="h-4 w-4" /></div>
                                   <div className="text-[10px]">
                                      <p className="text-slate-400 font-bold uppercase tracking-widest">Submitted By</p>
                                      <p className="text-slate-900 dark:text-white font-black uppercase">{comp.customerName}</p>
                                      <p className="text-slate-500 font-medium truncate">{comp.customerEmail}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl"><Clock className="h-4 w-4" /></div>
                                   <div className="text-[10px]">
                                      <p className="text-slate-400 font-bold uppercase tracking-widest">Time Registered</p>
                                      <p className="text-slate-900 dark:text-white font-black uppercase">{new Date(comp.createdAt).toLocaleString()}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="md:w-64 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-8 md:pt-0 md:pl-8">
                             {comp.status === 'pending' && (
                               <button 
                                 onClick={() => adminUpdateComplaintStatus(comp.id, 'resolved')}
                                 className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                               >
                                 Mark as Resolved
                               </button>
                             )}
                             <button 
                               onClick={() => adminDeleteComplaint(comp.id)}
                               className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                             >
                               Delete Complaint
                             </button>
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal overlays for Products (Add/Edit) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] w-full max-w-2xl p-8 sm:p-12 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
               <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all cursor-pointer"><X className="h-5 w-5" /></button>
               
               <div className="mb-10">
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{editingProduct ? 'Edit Logistics Entry' : 'Introduce New Protocol'}</h3>
                 <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Hardware Inventory Manifest Adjustment</p>
               </div>

               <form onSubmit={async (e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const data = Object.fromEntries(formData);
                 
                 const prodData = {
                   name: String(data.name),
                   description: String(data.description),
                   category: String(data.category),
                   price: Number(data.price),
                   stock: Number(data.stock),
                   imageUrl: String(data.imageUrl),
                   images: [String(data.imageUrl)],
                   badge: String(data.badge),
                   isFeatured: true,
                   features: ['Certified Components'],
                   specs: { 'Calibrated': 'Laboratory Level' }
                 };

                 if (editingProduct) {
                   await adminUpdateProduct(editingProduct.id, prodData);
                 } else {
                   await adminAddProduct(prodData);
                 }
                 setShowAddModal(false);
               }} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                       <input name="name" defaultValue={editingProduct?.name} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Sector</label>
                       <div className="relative">
                         <select name="category" defaultValue={editingProduct?.category || 'Audio'} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer">
                           <option>Audio</option>
                           <option>Keyboards</option>
                           <option>Wearables</option>
                           <option>Workspace</option>
                           <option>Laptops</option>
                           <option>Displays</option>
                           <option>Console</option>
                           <option>Other</option>
                         </select>
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ChevronRight className="h-4 w-4 rotate-90" />
                         </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valuation (₹)</label>
                       <input name="price" type="number" defaultValue={editingProduct?.price || 99} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Coordination</label>
                       <input name="stock" type="number" defaultValue={editingProduct?.stock || 10} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Link</label>
                    <input name="imageUrl" defaultValue={editingProduct?.imageUrl} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manifest Details</label>
                    <textarea name="description" rows={3} defaultValue={editingProduct?.description} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm resize-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metadata Badge</label>
                    <input name="badge" defaultValue={editingProduct?.badge} placeholder="e.g. LAB UNIT, FLAGSHIP" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm" />
                 </div>
                 <button type="submit" className="w-full py-6 bg-slate-900 dark:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Release Data Protocol
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default AdminDashboard;

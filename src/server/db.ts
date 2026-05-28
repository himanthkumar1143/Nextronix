import { Product, User, Order, OrderItem, ShippingAddress, Complaint } from '../types';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const rawUrl = process.env.SUPABASE_URL || 'https://pyuwpghagvflmuhptmpb.supabase.co';
const supabaseUrl = rawUrl.split('/rest/v1')[0].replace(/\/$/, '');
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_nav0Vb0aor3yR7KROeNGrg_l93riLpI';

console.log('Initializing Nextronix Supabase Engine:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseKey);

export const JWT_SECRET = process.env.JWT_SECRET || 'nextronix-default-jwt-secret-key-12345';

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyToken(token: string): any {
  try { return jwt.verify(token, JWT_SECRET); } 
  catch (err) { return null; }
}

export class DB {
  // Products
  static async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e: any) {
      console.error('Supabase getProducts error:', e.message);
      return [];
    }
  }

  static async getProductById(id: string): Promise<Product | undefined> {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Supabase getProductById error:', e.message);
      return undefined;
    }
  }

  static async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct = { 
      ...product, 
      id: `prod-${Date.now()}`, 
      createdAt: new Date().toISOString()
    };
    const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
    if (error) {
      console.error('Supabase addProduct insert error:', error.message);
      throw error;
    }
    return data;
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // Users & Admin Auth
  static async authenticateUser(email: string, pword: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pword });
    if (error) throw error;
    
    if (data.user) {
      const user: User = { 
        id: data.user.id, 
        name: data.user.user_metadata?.name || 'Admin', 
        email: data.user.email || email, 
        role: (data.user.user_metadata?.role as any) || 'admin' 
      };
      return { user, token: generateToken(user) };
    }
    return null;
  }

  static async getUserById(id: string): Promise<User | undefined> {
    const { data: { user } } = await supabase.auth.admin.getUserById(id).catch(() => ({ data: { user: null } }));
    if (user) {
      return {
        id: user.id,
        name: user.user_metadata?.name || 'Admin',
        email: user.email || '',
        role: (user.user_metadata?.role as any) || 'admin'
      };
    }
    return undefined;
  }

  // Complaints
  static async getComplaints() {
    const { data, error } = await supabase.from('complaints').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async addComplaint(complaint: any) {
    const newComp = { 
      ...complaint, 
      id: `comp-${Date.now()}`, 
      status: 'pending', 
      createdAt: new Date().toISOString() 
    };
    const { data, error } = await supabase.from('complaints').insert([newComp]).select().single();
    if (error) {
      console.error('Supabase addComplaint error:', error.message);
      throw error;
    }
    return data;
  }

  static async updateComplaintStatus(id: string, status: 'pending' | 'resolved') {
    const { data, error } = await supabase.from('complaints').update({ status }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  }

  static async deleteComplaint(id: string) {
    const { error } = await supabase.from('complaints').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // Orders
  static async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async getOrderById(id: string) {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  }

  static async createOrder(userId: string, email: string, name: string, phoneNumber: string, items: OrderItem[], totalAmount: number, shippingAddress: ShippingAddress, paymentMethod: string): Promise<Order> {
    const newOrder: Order = {
      id: `ORD${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      userEmail: email,
      userName: name,
      phoneNumber,
      items,
      totalAmount,
      shippingAddress,
      status: 'Order Confirmed',
      paymentMethod,
      createdAt: new Date().toISOString()
    };
    
    console.log('Attempting to create order in Supabase:', newOrder.id);
    const { data, error } = await supabase.from('orders').insert([newOrder]).select().single();
    
    if (error) {
      console.error('Supabase createOrder error:', error.message, error.details, error.hint);
      throw new Error(`Order placement failed: ${error.message}`);
    }
    
    return data;
  }

  static async getOrdersByContact(contact: string): Promise<Order[]> {
    console.log(`DB: Searching orders for contact: ${contact}`);
    const { data, error } = await supabase.from('orders')
      .select('*')
      .or(`userEmail.ilike."${contact}",phoneNumber.ilike."${contact}"`)
      .order('createdAt', { ascending: false });
    if (error) {
      console.error('DB: Orders by contact error:', error);
      throw error;
    }
    return data || [];
  }

  static async getSecureOrder(id: string, contact: string): Promise<Order | undefined> {
    console.log(`DB: Secure tracking for order: ${id} with contact: ${contact}`);
    const { data, error } = await supabase.from('orders')
      .select('*')
      .eq('id', id)
      .or(`userEmail.ilike."${contact}",phoneNumber.ilike."${contact}"`)
      .maybeSingle();
    if (error) {
      console.error('DB: Secure order fetch error:', error);
      throw error;
    }
    return data;
  }

  static async updateOrderStatus(id: string, status: Order['status']) {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  }

  static async deleteOrder(id: string) {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  static async getDashboardStats() {
    const [products, orders, complaints] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact' }),
      supabase.from('complaints').select('*', { count: 'exact', head: true })
    ]);

    const orderData = orders.data || [];
    const stats = {
      totalProducts: products.count || 0,
      totalOrders: orders.count || 0,
      totalComplaints: complaints.count || 0,
      pendingOrders: orderData.filter(o => o.status === 'Order Confirmed' || o.status === 'Packed').length,
      shippedOrders: orderData.filter(o => o.status === 'Shipped' || o.status === 'Out for Delivery').length,
      deliveredOrders: orderData.filter(o => o.status === 'Delivered').length,
      cancelledOrders: orderData.filter(o => o.status === 'Cancelled').length,
    };
    return stats;
  }
}

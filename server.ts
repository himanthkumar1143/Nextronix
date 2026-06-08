import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DB, verifyToken, supabase } from './src/server/db';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(express.json({ strict: false }));
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      console.error('Invalid JSON received:', err.message);
      return res.status(400).json({ error: 'System received a malformed data payload. Please ensure your inputs are valid.' });
    }
    next();
  });

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // Auth Middleware (mainly for Admin)
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });
    (req as any).user = decoded;
    next();
  };

  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    requireAuth(req, res, () => {
      if ((req as any).user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    });
  };

  // =================== AUTH ENDPOINTS (ADMIN ONLY) ===================

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const auth = await DB.authenticateUser(email, password);
      if (!auth) return res.status(401).json({ error: 'Invalid credentials or access denied.' });
      res.json(auth);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
      const user = await DB.getUserById((req as any).user.id);
      if (!user) return res.status(404).json({ error: 'Session lost.' });
      res.json(user);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // =================== CUSTOMER & GUEST FEATURES ===================

  // GUEST ORDER SUBMISSION (No login required)
  app.post('/api/orders', async (req, res) => {
    try {
      const { userName, userEmail, phoneNumber, items, totalAmount, shippingAddress, paymentMethod } = req.body;
      if (!items || !items.length || !shippingAddress || !totalAmount) {
        return res.status(400).json({ error: 'Incomplete order checkout details' });
      }
      const order = await DB.createOrder(
        'guest', // userId placeholder for guest
        userEmail || 'guest@example.com',
        userName || 'Guest Customer',
        phoneNumber || '',
        items,
        totalAmount,
        shippingAddress,
        paymentMethod || 'Simulated Credit Card'
      );
      res.status(201).json(order);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/complaints', async (req, res) => {
    try {
      const complaint = await DB.addComplaint(req.body);
      res.status(201).json(complaint);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/orders/track/:id', async (req, res) => {
    try {
      const { contact } = req.query;
      if (!contact) return res.status(400).json({ error: 'Contact verification (email or phone) required' });
      const order = await DB.getSecureOrder(req.params.id, contact as string);
      if (!order) return res.status(404).json({ error: 'Order not found or invalid credentials' });
      res.json(order);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/orders/my-orders', async (req, res) => {
    try {
      const { contact } = req.query;
      if (!contact) return res.status(400).json({ error: 'Contact detail required' });
      const list = await DB.getOrdersByContact(contact as string);
      res.json(list);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // =================== PRODUCTS ENDPOINTS ===================

  app.get('/api/products', async (req, res) => {
    try {
      let list = await DB.getProducts();
      // Apply filters from query
      const q = (req.query.q as string)?.toLowerCase().trim();
      if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      
      const category = req.query.category as string;
      if (category && category !== 'All') list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());

      const maxPrice = Number(req.query.maxPrice);
      if (!isNaN(maxPrice) && maxPrice > 0) list = list.filter(p => p.price <= maxPrice);

      const inStock = req.query.inStock === 'true';
      if (inStock) list = list.filter(p => p.stock > 0);

      const sort = req.query.sort as string;
      if (sort === 'price-asc') list.sort((a,b) => a.price - b.price);
      else if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
      else list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json(list);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const item = await DB.getProductById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Product not found' });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Admin Product Controls
  app.post('/api/products', requireAdmin, async (req, res) => {
    try {
      res.status(201).json(await DB.addProduct(req.body));
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const item = await DB.updateProduct(req.params.id, req.body);
      if (!item) return res.status(404).json({ error: 'Product not found' });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      if (await DB.deleteProduct(req.params.id)) res.json({ success: true });
      else res.status(404).json({ error: 'Product not found' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // =================== ADMIN MANAGEMENT ===================

  app.get('/api/admin/orders', requireAdmin, async (req, res) => {
    try { res.json(await DB.getOrders()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/orders/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await DB.updateOrderStatus(req.params.id, req.body.status);
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      res.json(updated);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/admin/orders/:id', requireAdmin, async (req, res) => {
    try {
      if (await DB.deleteOrder(req.params.id)) res.json({ success: true });
      else res.status(404).json({ error: 'Order not found' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/complaints', requireAdmin, async (req, res) => {
    try { res.json(await DB.getComplaints()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch('/api/admin/complaints/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await DB.updateComplaintStatus(req.params.id, req.body.status);
      res.json(updated);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/admin/complaints/:id', requireAdmin, async (req, res) => {
    try {
      await DB.deleteComplaint(req.params.id);
      res.status(204).end();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try { res.json(await DB.getDashboardStats()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try { res.json([]); } // Listing users is restricted in Supabase client context
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // 404 handler for API routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.url}` });
  });

  // Static Assets or Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

startServer();

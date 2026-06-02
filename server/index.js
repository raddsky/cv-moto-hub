import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

// PostgreSQL connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        stock INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        total_amount REAL NOT NULL,
        payment_method TEXT,
        payment_status TEXT DEFAULT 'pending',
        order_status TEXT DEFAULT 'pending',
        shipping_address TEXT,
        items JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        session_id TEXT,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS config (
        id SERIAL PRIMARY KEY,
        webhook_url TEXT DEFAULT ''
      );
    `);

    // Check if config exists, if not insert default
    const configResult = await pool.query('SELECT * FROM config WHERE id = 1');
    if (configResult.rows.length === 0) {
      await pool.query('INSERT INTO config (id, webhook_url) VALUES (1, $1)', ['']);
    }

    // Seed products if empty
    const productCount = await pool.query('SELECT COUNT(*) as count FROM products');
    if (productCount.rows[0].count === 0) {
      const seedProducts = [
        { name: 'Performance Exhaust System', description: 'High-performance exhaust system for improved horsepower and sound. Made from stainless steel with ceramic coating for durability. Easy bolt-on installation.', price: 299.99, category: 'Exhaust', image: '🏍️', stock: 25, rating: 4.8 },
        { name: 'LED Headlight Kit', description: 'Ultra-bright LED headlight conversion kit. Includes H4, H7, and H11 adapters. 6000K white light output for better night visibility.', price: 149.99, category: 'Lighting', image: '💡', stock: 40, rating: 4.6 },
        { name: 'Carbon Fiber Fairing', description: 'Lightweight carbon fiber fairing set. Pre-drilled for easy installation. UV-resistant clear coat finish. Fits most sport bikes.', price: 449.99, category: 'Body', image: '🎯', stock: 15, rating: 4.9 },
        { name: 'Brake Pad Set', description: 'Premium ceramic brake pads for superior stopping power. Low dust formula keeps wheels clean. Includes front and rear pads.', price: 79.99, category: 'Brakes', image: '🛑', stock: 60, rating: 4.5 },
        { name: 'Oil Filter Premium', description: 'High-flow oil filter with synthetic media. Traps 99% of harmful contaminants. Compatible with all major motorcycle brands.', price: 24.99, category: 'Maintenance', image: '⚙️', stock: 100, rating: 4.7 },
        { name: 'Chain & Sprocket Kit', description: 'Complete chain and sprocket replacement kit. Includes O-ring chain, front and rear sprockets. Pre-stretched for minimal adjustment.', price: 189.99, category: 'Drivetrain', image: '⛓️', stock: 30, rating: 4.8 },
        { name: 'Grip Handles Pro', description: 'Ergonomic motorcycle grips with vibration damping. Anti-slip texture for better control. Universal fit for most handlebars.', price: 34.99, category: 'Controls', image: '🎮', stock: 75, rating: 4.4 },
        { name: 'Suspension Upgrade', description: 'Adjustable front and rear suspension kit. Improve handling and comfort. Includes springs and dampers.', price: 599.99, category: 'Suspension', image: '🔧', stock: 10, rating: 4.9 },
        { name: 'Air Filter High-Flow', description: 'High-flow air filter for increased engine performance. Washable and reusable. Lifetime warranty.', price: 45.99, category: 'Engine', image: '🌬️', stock: 50, rating: 4.6 },
        { name: 'Fuel Controller', description: 'Programmable fuel injection controller. Optimize fuel mapping for performance. USB interface for easy tuning.', price: 249.99, category: 'Engine', image: '⛽', stock: 20, rating: 4.7 },
      ];

      for (const product of seedProducts) {
        await pool.query(
          'INSERT INTO products (name, description, price, category, image, stock, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [product.name, product.description, product.price, product.category, product.image, product.stock, product.rating]
        );
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDatabase();

// Webhook function to send data to n8n
const sendToWebhook = async (product, action) => {
  try {
    const configResult = await pool.query('SELECT webhook_url FROM config WHERE id = 1');
    const webhookUrl = configResult.rows[0]?.webhook_url;
    if (!webhookUrl) return;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        product,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('Webhook failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
};

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE category = $1', [req.params.category]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new product (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, category, image, stock, rating } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, category, image, stock, rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, category, image, stock, rating]
    );
    const newProduct = result.rows[0];
    await sendToWebhook(newProduct, 'create');
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update product (Admin)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, price, category, image, stock, rating } = req.body;
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, image = $5, stock = $6, rating = $7 WHERE id = $8 RETURNING *',
      [name, description, price, category, image, stock, rating, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await sendToWebhook(result.rows[0], 'update');
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete product (Admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await sendToWebhook(result.rows[0], 'delete');
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Cart endpoints
app.get('/api/cart/:sessionId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cart.*, products.name, products.price, products.image, products.stock
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.session_id = $1
    `, [req.params.sessionId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { session_id, product_id, quantity } = req.body;
    const existing = await pool.query(
      'SELECT * FROM cart WHERE session_id = $1 AND product_id = $2',
      [session_id, product_id]
    );
    
    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE id = $2',
        [quantity, existing.rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart (session_id, product_id, quantity) VALUES ($1, $2, $3)',
        [session_id, product_id, quantity]
      );
    }
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    await pool.query('UPDATE cart SET quantity = $1 WHERE id = $2', [quantity, req.params.id]);
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/cart/session/:sessionId', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE session_id = $1', [req.params.sessionId]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Order endpoints
app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, total_amount, payment_method, shipping_address, items, session_id } = req.body;
    
    const result = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount, payment_method, shipping_address, items) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [customer_name, customer_email, customer_phone, total_amount, payment_method, shipping_address, JSON.stringify(items)]
    );
    
    const orderId = result.rows[0].id;
    
    // Update product stock
    for (const item of items) {
      await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }
    
    // Clear cart
    await pool.query('DELETE FROM cart WHERE session_id = $1', [session_id]);
    
    res.json({ order_id: orderId, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products');
    res.json(result.rows.map(row => row.category));
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Webhook configuration endpoints
app.get('/api/config/webhook', async (req, res) => {
  try {
    const result = await pool.query('SELECT webhook_url FROM config WHERE id = 1');
    res.json({ webhookUrl: result.rows[0]?.webhook_url || '' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/config/webhook', async (req, res) => {
  try {
    await pool.query('UPDATE config SET webhook_url = $1 WHERE id = 1', [req.body.webhookUrl]);
    res.json({ message: 'Webhook URL updated', webhookUrl: req.body.webhookUrl });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

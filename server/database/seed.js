const db = require('./db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('Seeding database for India E-Commerce...');

  try {
    // Enable Foreign Keys
    await db.execute('PRAGMA foreign_keys = ON;');

    // 1. Users Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Products Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        original_price REAL,
        image_url TEXT NOT NULL,
        rating REAL DEFAULT 4.5,
        stock INTEGER NOT NULL DEFAULT 10,
        is_featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Orders Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        coupon_code TEXT,
        status TEXT NOT NULL DEFAULT 'Confirmed',
        shipping_name TEXT NOT NULL,
        shipping_email TEXT NOT NULL,
        shipping_phone TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        shipping_city TEXT NOT NULL,
        shipping_state TEXT NOT NULL,
        shipping_postal_code TEXT NOT NULL,
        shipping_country TEXT NOT NULL DEFAULT 'India',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 4. Order Items Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    // 5. Cart Items Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE(user_id, product_id)
      );
    `);

    // 6. Wishlist Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE(user_id, product_id)
      );
    `);

    // 7. Reviews Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Coupons Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_order_amount REAL DEFAULT 0
      );
    `);

    // Seed Demo User
    const existingDemoUser = await db.getOne('SELECT * FROM users WHERE email = ?', ['demo@aura.com']);
    let demoUserId;
    if (!existingDemoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Password123', salt);
      const userRes = await db.execute(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        ['Aaditya Devghare', 'demo@aura.com', hashedPassword]
      );
      demoUserId = userRes.lastID;
    } else {
      demoUserId = existingDemoUser.id;
    }

    // Seed Coupons (INR focused)
    const existingCoupon = await db.getOne('SELECT * FROM coupons WHERE code = ?', ['AURA10']);
    if (!existingCoupon) {
      await db.execute('INSERT INTO coupons (code, discount_type, discount_value, min_order_amount) VALUES (?, ?, ?, ?)', ['AURA10', 'percent', 10, 0]);
      await db.execute('INSERT INTO coupons (code, discount_type, discount_value, min_order_amount) VALUES (?, ?, ?, ?)', ['SAVE500', 'fixed', 500, 2000]);
      await db.execute('INSERT INTO coupons (code, discount_type, discount_value, min_order_amount) VALUES (?, ?, ?, ?)', ['WELCOME15', 'percent', 15, 1000]);
    }

    // Clear existing products and reseed in ₹ INR
    await db.execute('DELETE FROM products;');

    const products = [
      {
        name: 'Aura Sound Core Pro Wireless Headphones',
        description: 'Studio-grade active noise cancellation, custom dynamic drivers, 40-hour battery life. Designed with memory foam cushions and durable aluminum frame.',
        category: 'Electronics',
        price: 14999.00,
        original_price: 18999.00,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        stock: 24,
        is_featured: 1
      },
      {
        name: 'Minimalist Chronograph Leather Watch',
        description: 'Precision Japanese Quartz movement housed in surgical-grade 316L stainless steel with scratch-resistant sapphire crystal and genuine Italian leather strap.',
        category: 'Accessories',
        price: 9999.00,
        original_price: 12499.00,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        stock: 15,
        is_featured: 1
      },
      {
        name: 'Nordic Artisan Ceramic Coffee Set',
        description: 'Hand-cast ceramic pour-over carafe and matching double-walled cups with matte tactile glaze. Perfect for daily rituals and heat retention.',
        category: 'Home & Lifestyle',
        price: 3499.00,
        original_price: 4499.00,
        image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        stock: 30,
        is_featured: 1
      },
      {
        name: 'Merino Wool Oversized Knit Cardigan',
        description: 'Ultra-soft 100% extra-fine Merino wool cardigan featuring horn button closures, dropped shoulders, and ribbed trim details.',
        category: 'Fashion',
        price: 6499.00,
        original_price: 7999.00,
        image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        stock: 18,
        is_featured: 1
      },
      {
        name: 'Ergonomic Aluminum Laptop Stand',
        description: 'CNC-machined anodized aluminum stand elevating laptops to ergonomic eye level. Promotes maximum airflow with anti-slip silicone pads.',
        category: 'Electronics',
        price: 2999.00,
        original_price: 3999.00,
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        stock: 40,
        is_featured: 1
      },
      {
        name: 'Handcrafted Vegetable-Tanned Leather Tote',
        description: 'Spacious structured tote bag constructed from vegetable-tanned full-grain leather that develops a rich patina over time. Includes laptop sleeve.',
        category: 'Fashion',
        price: 11999.00,
        original_price: 14499.00,
        image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        stock: 12,
        is_featured: 1
      },
      {
        name: 'Aura Lumina Smart Ambient Desk Lamp',
        description: 'Adjustable color temperature (2700K-6500K) with flicker-free eye-care lighting technology, wireless phone charging base, and touch controls.',
        category: 'Home & Lifestyle',
        price: 4999.00,
        original_price: 6499.00,
        image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        stock: 25,
        is_featured: 1
      },
      {
        name: 'Titanium Active ANC Earbuds',
        description: 'Compact IPX7 waterproof wireless earbuds with hybrid noise cancellation, dual beamforming microphones, and touch controls.',
        category: 'Electronics',
        price: 8999.00,
        original_price: 10999.00,
        image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        stock: 20,
        is_featured: 1
      },
      {
        name: 'Organic Heavyweight Cotton Crewneck',
        description: 'Pre-shrunk 400 GSM organic French terry cotton sweatshirt designed with a relaxed boxy silhouette and flatlock stitching.',
        category: 'Fashion',
        price: 3999.00,
        original_price: 4999.00,
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        rating: 4.4,
        stock: 35,
        is_featured: 0
      },
      {
        name: 'Polarized Matte Black Sunglasses',
        description: 'Lightweight acetate frame fitted with Category 3 polarized lenses providing 100% UV400 protection and anti-reflective coating.',
        category: 'Accessories',
        price: 3499.00,
        original_price: 4499.00,
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        stock: 28,
        is_featured: 0
      },
      {
        name: 'Ultrasonic Essential Oil Aromatic Diffuser',
        description: 'Whisper-quiet ceramic ultrasonic diffuser featuring warm ambient LED mood lighting, automatic safety shut-off, and mist timer settings.',
        category: 'Home & Lifestyle',
        price: 2499.00,
        original_price: 3199.00,
        image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        stock: 50,
        is_featured: 0
      },
      {
        name: 'Full-Grain Slim Leather Wallet',
        description: 'Minimalist bi-fold wallet featuring RFID-blocking technology, 6 card slots, and an easy-access bill compartment in top-grain leather.',
        category: 'Accessories',
        price: 2899.00,
        original_price: 3699.00,
        image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        stock: 42,
        is_featured: 0
      },
      {
        name: 'Tactile Wireless Mechanical Keyboard',
        description: 'Compact 75% hot-swappable mechanical keyboard with custom tuned linear switches, per-key RGB backlight, and dual Bluetooth/USB-C.',
        category: 'Electronics',
        price: 7999.00,
        original_price: 9999.00,
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        stock: 14,
        is_featured: 0
      },
      {
        name: 'Minimalist Water-Resistant Canvas Backpack',
        description: 'Durable 16oz waxed canvas backpack with padded 15.6" laptop compartment, magnetic quick-release buckles, and water-repellent coating.',
        category: 'Accessories',
        price: 4999.00,
        original_price: 6199.00,
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        stock: 22,
        is_featured: 0
      },
      {
        name: '100% Satin Mulberry Silk Bedding Set',
        description: 'Luxurious 22-Momme Mulberry silk sheet and pillowcase set. Hypoallergenic, breathable, and gentle on hair and skin during sleep.',
        category: 'Home & Lifestyle',
        price: 8999.00,
        original_price: 10999.00,
        image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        stock: 10,
        is_featured: 0
      },
      {
        name: 'Tailored Slim-Fit Linen Blazer',
        description: 'Breathable unlined summer blazer crafted from premium linen-cotton blend. Features notch lapels and natural horn buttons.',
        category: 'Fashion',
        price: 9499.00,
        original_price: 11999.00,
        image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        stock: 16,
        is_featured: 0
      }
    ];

    for (const p of products) {
      await db.execute(
        `INSERT INTO products (name, description, category, price, original_price, image_url, rating, stock, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.description, p.category, p.price, p.original_price, p.image_url, p.rating, p.stock, p.is_featured]
      );
    }
    console.log('Seeded 16 products in ₹ INR!');

    // Seed Sample Reviews
    await db.execute('DELETE FROM reviews;');
    await db.execute(
      `INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)`,
      [1, demoUserId, 'Aaditya Devghare', 5, 'Outstanding active noise cancellation and crystal clear audio! Express delivery to Mumbai took just 1 day!']
    );
    await db.execute(
      `INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)`,
      [1, demoUserId, 'Priya Sharma', 5, 'Super comfortable cushions, battery lasts for almost a week of office work!']
    );

    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;

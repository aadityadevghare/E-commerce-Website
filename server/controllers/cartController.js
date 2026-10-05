const db = require('../database/db');

exports.getCart = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ success: true, items: [], total: 0 });
    }

    const items = await db.query(
      `SELECT c.id as cart_item_id, c.quantity, p.id as product_id, p.name, p.price, p.original_price, p.image_url, p.category, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    let total = 0;
    const formattedItems = items.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return {
        ...item,
        subtotal: parseFloat(subtotal.toFixed(2))
      };
    });

    res.json({
      success: true,
      items: formattedItems,
      total: parseFloat(total.toFixed(2)),
      count: formattedItems.reduce((acc, item) => acc + item.quantity, 0)
    });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10);

    if (!productId || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product or quantity.' });
    }

    const product = await db.getOne('SELECT id, stock, name FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please sign in to save cart to account.' });
    }

    // Check existing in DB cart
    const existing = await db.getOne(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    const newQuantity = existing ? existing.quantity + qty : qty;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock.`
      });
    }

    if (existing) {
      await db.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existing.id]
      );
    } else {
      await db.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, productId, qty]
      );
    }

    res.json({
      success: true,
      message: `Added "${product.name}" to cart.`
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params; // cart item id
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (qty <= 0) {
      await db.execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, req.user.id]);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }

    // Check item & stock
    const cartItem = await db.getOne(
      `SELECT c.id, c.product_id, p.stock, p.name 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.id = ? AND c.user_id = ?`,
      [id, req.user.id]
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    if (qty > cartItem.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.stock} items in stock.`
      });
    }

    await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [qty, id]);

    res.json({ success: true, message: 'Cart updated successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await db.execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, req.user.id]);

    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    next(err);
  }
};

const db = require('../database/db');

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please log in to complete your order.' });
    }

    const {
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      items // optional fallback array if guest or passed items
    } = req.body;

    if (
      !shippingName ||
      !shippingEmail ||
      !shippingPhone ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode ||
      !shippingCountry
    ) {
      return res.status(400).json({ success: false, message: 'All shipping details are required.' });
    }

    // 1. Retrieve cart items for user
    let cartItems = await db.query(
      `SELECT c.id as cart_item_id, c.product_id, c.quantity, p.price, p.stock, p.name 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    // If DB cart is empty, check if items array was supplied in body
    if (cartItems.length === 0 && Array.isArray(items) && items.length > 0) {
      cartItems = [];
      for (const item of items) {
        const prod = await db.getOne('SELECT id as product_id, price, stock, name FROM products WHERE id = ?', [item.productId]);
        if (prod) {
          cartItems.push({
            product_id: prod.product_id,
            quantity: item.quantity,
            price: prod.price,
            stock: prod.stock,
            name: prod.name
          });
        }
      }
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
    }

    // 2. Validate stock for all items before making changes
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.name}". Only ${item.stock} left.`
        });
      }
    }

    // 3. Calculate total strictly on backend
    let calculatedTotal = 0;
    for (const item of cartItems) {
      calculatedTotal += item.price * item.quantity;
    }

    // Round to 2 decimals
    calculatedTotal = parseFloat(calculatedTotal.toFixed(2));

    // 4. Insert Order
    const orderRes = await db.execute(
      `INSERT INTO orders 
       (user_id, total_amount, status, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_postal_code, shipping_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        calculatedTotal,
        'Confirmed',
        shippingName.trim(),
        shippingEmail.trim(),
        shippingPhone.trim(),
        shippingAddress.trim(),
        shippingCity.trim(),
        shippingState.trim(),
        shippingPostalCode.trim(),
        shippingCountry.trim()
      ]
    );

    const orderId = orderRes.lastID;

    // 5. Insert Order Items & Update Product Stock
    for (const item of cartItems) {
      await db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Reduce Stock
      await db.execute(
        `UPDATE products SET stock = stock - ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // 6. Clear user cart
    await db.execute(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId,
      totalAmount: calculatedTotal
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Fetch items for each order
    for (const order of orders) {
      const items = await db.query(
        `SELECT oi.*, p.name, p.image_url, p.category 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({
      success: true,
      orders
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await db.getOne(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const items = await db.query(
      `SELECT oi.*, p.name, p.image_url, p.category 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );

    order.items = items;

    res.json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

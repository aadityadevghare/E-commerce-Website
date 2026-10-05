const db = require('../database/db');

exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await db.query(
      `SELECT w.id as wishlist_id, p.* 
       FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ? ORDER BY w.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      items
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const existing = await db.getOne(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing) {
      await db.execute('DELETE FROM wishlists WHERE id = ?', [existing.id]);
      res.json({ success: true, isWishlisted: false, message: 'Removed from Wishlist.' });
    } else {
      await db.execute('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [userId, productId]);
      res.json({ success: true, isWishlisted: true, message: 'Saved to Wishlist!' });
    }
  } catch (err) {
    next(err);
  }
};

exports.checkWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const existing = await db.getOne(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({
      success: true,
      isWishlisted: !!existing
    });
  } catch (err) {
    next(err);
  }
};

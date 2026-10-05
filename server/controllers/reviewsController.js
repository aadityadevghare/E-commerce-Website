const db = require('../database/db');

exports.getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await db.query(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({
      success: true,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { id } = req.params; // product id
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    if (!rating || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a valid rating (1-5) and comment.' });
    }

    const product = await db.getOne('SELECT id FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await db.execute(
      'INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [id, userId, userName, parseInt(rating, 10), comment.trim()]
    );

    // Recalculate product rating average
    const avgData = await db.getOne(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ?',
      [id]
    );

    if (avgData && avgData.avg_rating) {
      await db.execute(
        'UPDATE products SET rating = ? WHERE id = ?',
        [parseFloat(avgData.avg_rating.toFixed(1)), id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!'
    });
  } catch (err) {
    next(err);
  }
};

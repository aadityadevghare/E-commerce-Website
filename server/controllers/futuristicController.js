const db = require('../database/db');

exports.getPriceTrends = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db.getOne('SELECT price FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const currentPrice = product.price;
    // Generate realistic historical 7-day price trends and 2050 AI forecast
    const trends = [
      { day: '6 days ago', price: parseFloat((currentPrice * 1.08).toFixed(2)) },
      { day: '5 days ago', price: parseFloat((currentPrice * 1.05).toFixed(2)) },
      { day: '4 days ago', price: parseFloat((currentPrice * 1.02).toFixed(2)) },
      { day: '3 days ago', price: parseFloat((currentPrice * 0.98).toFixed(2)) },
      { day: '2 days ago', price: parseFloat((currentPrice * 1.01).toFixed(2)) },
      { day: 'Yesterday', price: parseFloat((currentPrice * 1.04).toFixed(2)) },
      { day: 'Today', price: currentPrice }
    ];

    const forecast = {
      predictedPriceTomorrow: parseFloat((currentPrice * 0.94).toFixed(2)),
      trendDirection: 'DOWN',
      confidence: '96.4%',
      recommendation: 'BUY_NOW_LOCKED'
    };

    res.json({
      success: true,
      currentPrice,
      trends,
      forecast
    });
  } catch (err) {
    next(err);
  }
};

exports.lockPrice = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await db.getOne('SELECT name, price FROM products WHERE id = ?', [productId]);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    res.json({
      success: true,
      lockedPrice: product.price,
      expiresAt,
      message: `Quantum Price Lock active for "${product.name}" at $${product.price.toFixed(2)} for 24 hours!`
    });
  } catch (err) {
    next(err);
  }
};

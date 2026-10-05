const db = require('../database/db');

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await db.getOne(
      'SELECT * FROM coupons WHERE UPPER(code) = UPPER(?)',
      [code.trim()]
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    if (cartTotal && cartTotal < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum order amount of $${coupon.min_order_amount.toFixed(2)}.`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = (cartTotal * coupon.discount_value) / 100;
    } else {
      discountAmount = coupon.discount_value;
    }

    discountAmount = Math.min(discountAmount, cartTotal);

    res.json({
      success: true,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      message: `Coupon "${coupon.code}" applied successfully!`
    });
  } catch (err) {
    next(err);
  }
};

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { optionalAuthenticateToken, authenticateToken } = require('../middleware/auth');

router.get('/', optionalAuthenticateToken, cartController.getCart);
router.post('/', optionalAuthenticateToken, cartController.addToCart);
router.put('/:id', authenticateToken, cartController.updateCartItem);
router.delete('/:id', authenticateToken, cartController.removeCartItem);
router.delete('/', authenticateToken, cartController.clearCart);

module.exports = router;

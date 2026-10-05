const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, ordersController.createOrder);
router.get('/', authenticateToken, ordersController.getUserOrders);
router.get('/:id', authenticateToken, ordersController.getOrderById);

module.exports = router;

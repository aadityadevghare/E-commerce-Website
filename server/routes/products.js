const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const reviewsController = require('../controllers/reviewsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.get('/:id/reviews', reviewsController.getProductReviews);
router.post('/:id/reviews', authenticateToken, reviewsController.addReview);

module.exports = router;

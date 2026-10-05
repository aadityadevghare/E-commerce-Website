const express = require('express');
const router = express.Router();
const futuristicController = require('../controllers/futuristicController');

router.get('/price-trends/:id', futuristicController.getPriceTrends);
router.post('/price-lock', futuristicController.lockPrice);

module.exports = router;

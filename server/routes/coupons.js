const express = require('express');
const router = express.Router();
const couponsController = require('../controllers/couponsController');

router.post('/validate', couponsController.validateCoupon);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
    createPurchase,
    getAllPurchase,
    getPurchaseById,
    getDashboardPurchaseTotal
}= require('../Controllers/purchaseControllers.js');

router.post('/',createPurchase);
router.get('/',getAllPurchase);
router.get('/todays-purchase-total',getDashboardPurchaseTotal);
router.get('/:id',getPurchaseById);

module.exports = router;
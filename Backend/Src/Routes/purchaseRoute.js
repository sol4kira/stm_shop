const express = require('express');
const router = express.Router();

const {
    createPurchase,
    getAllPurchase,
    getPurchaseById,
    getDashboardPurchaseTotal,
    getPurchaseSummary,
    getPurchaseDetails
}= require('../Controllers/purchaseControllers.js');

router.post('/',createPurchase);
router.get('/',getAllPurchase);
router.get('/todays-purchase-total',getDashboardPurchaseTotal);
router.get('/report-summary',getPurchaseSummary);
router.get('/report-details',getPurchaseDetails);
router.get('/:id',getPurchaseById);

module.exports = router;
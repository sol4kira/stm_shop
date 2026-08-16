const express = require('express');
const router = express.Router();

const {
    createSale,
    getAllSale,
    getSaleById,
    getDashboardSalesTotal,
    getSalesSummary,
    getSalesDetails
}= require('../Controllers/salesControllers.js');

router.post('/',createSale);
router.get('/',getAllSale);
router.get('/todays-sales-total',getDashboardSalesTotal);
router.get('/report-summary',getSalesSummary);
router.get('/report-details',getSalesDetails);
router.get('/:id',getSaleById);

module.exports = router;
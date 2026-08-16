const express = require('express');
const router = express.Router();

const{
    getSaleCredit,
    getSaleCreditById,
    getSaleCreditByCustomerId,
    createSaleCreditPayment,
    getSaleCreditPayments,
    getDashboardCustomerCredit,
    getCustomerCreditsReportDetails
}= require('../Controllers/saleCreditControllers.js');

router.get('/', getSaleCredit);
router.get('/customer/:customerId', getSaleCreditByCustomerId);
router.get('/sale-credit-deadline',getDashboardCustomerCredit);
router.get('/report-summary',getCustomerCreditsReportDetails);
router.get('/:id', getSaleCreditById);
router.post('/:creditId/payment', createSaleCreditPayment);
router.get('/:creditId/payments', getSaleCreditPayments);

module.exports = router;
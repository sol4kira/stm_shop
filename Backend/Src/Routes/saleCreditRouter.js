const express = require('express');
const router = express.Router();

const{
    getSaleCredit,
    getSaleCreditById,
    getSaleCreditByCustomerId,
    createSaleCreditPayment,
    getSaleCreditPayments
}= require('../Controllers/saleCreditControllers.js');

router.get('/', getSaleCredit);
router.get('/customer/:customerId', getSaleCreditByCustomerId);
router.get('/:id', getSaleCreditById);
router.post('/:creditId/payment', createSaleCreditPayment);
router.get('/:creditId/payments', getSaleCreditPayments);

module.exports = router;
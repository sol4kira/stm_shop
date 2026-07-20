const express = require('express');
const router = express.Router();

const{
    getPurchaseCredit,
    getPurchaseCreditById,
    getPurchaseCreditBySupplierId,
    createPurchaseCreditPayment,
    getPurchaseCreditPayments,
    getDashboardSupplierCredit
}= require('../Controllers/purchaseCreditControllers.js');

router.get('/', getPurchaseCredit);
router.get('/supplier/:supplierId', getPurchaseCreditBySupplierId);
router.get('/purchase-credit-deadline',getDashboardSupplierCredit);
router.get('/:id', getPurchaseCreditById);
router.post('/:creditId/payment', createPurchaseCreditPayment);
router.get('/:creditId/payment', getPurchaseCreditPayments);

module.exports = router;
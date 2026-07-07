const express = require('express');
const router = express.Router();

const {
    createPurchase,
    getAllPurchase,
    getPurchaseById,
    getNearestSupplierCreditDeadline
}= require('../Controllers/purchaseControllers.js');

router.post('/',createPurchase);
router.get('/',getAllPurchase);
router.get('/nearest-deadline',getNearestSupplierCreditDeadline);
router.get('/:id',getPurchaseById);

module.exports = router;
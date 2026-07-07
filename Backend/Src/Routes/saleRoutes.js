const express = require('express');
const router = express.Router();

const {
    createSale,
    getAllSale,
    getSaleById
}= require('../Controllers/salesControllers.js');

router.post('/',createSale);
router.get('/',getAllSale);
router.get('/:id',getSaleById);

module.exports = router;
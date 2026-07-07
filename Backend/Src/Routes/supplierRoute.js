const express = require('express');
const router = express.Router();

const { getAllSuppliers,
        getSupplierById,
        getSupplierByName,
        createSupplier,
        updateSupplier,
        deleteSupplier
}= require('../Controllers/supplierControllers.js')


router.get('/',getAllSuppliers);
router.get('/:id',getSupplierById);
router.get('/name/:name',getSupplierByName);
router.post('/',createSupplier);
router.put('/:id',updateSupplier);
router.delete('/:id',deleteSupplier);

module.exports = router;
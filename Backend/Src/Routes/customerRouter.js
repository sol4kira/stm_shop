const express = require('express');
const router = express.Router();

const { getCustomer,
        getCustomerById,
        getCustomerByName,
        createCustomer,
        updateCustomer,
        deleteCustomer
 } = require ('../Controllers/customerControllers.js')

router.get('/',getCustomer);
router.get('/:id',getCustomerById);
router.get('/name/:name',getCustomerByName);
router.post('/',createCustomer);
router.put('/:id',updateCustomer);
router.delete('/:id',deleteCustomer);

module.exports = router;
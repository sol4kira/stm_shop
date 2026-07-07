const express = require('express');
const router = express.Router();

const { getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        getLowStockProducts
 } = require ('../Controllers/productControllers.js')

router.get('/',getAllProducts);
route.get('/low-stack',getLowStockProducts)
router.get('/:id',getProductById);
router.post('/',createProduct);
router.put('/:id',updateProduct);
router.delete('/:id', deleteProduct);


module.exports = router;
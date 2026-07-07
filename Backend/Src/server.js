    const express = require('express');
    const cors = require('cors');
    require('dotenv').config();

    const productRoute = require('./Routes/productRoute.js')
    const suppliersRoute = require('./Routes/supplierRoute.js')
    const customerRoute = require('./Routes/customerRouter.js')
    const saleRoute = require('./Routes/saleRoutes.js')
    const purchaseRoute = require('./Routes/purchaseRoute.js')
    const purchaseCreditRoute = require('./Routes/purchaseCreditRouter.js')
    const saleCreditRoute = require('./Routes/saleCreditRouter.js')

    const app =express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/products' , productRoute)
    app.use('/api/supplier', suppliersRoute)
    app.use('/api/customer', customerRoute)
    app.use('/api/sales', saleRoute)
    app.use('/api/purchase', purchaseRoute)
    app.use('/api/purchase-credit', purchaseCreditRoute)
    app.use('/api/sale-credit',saleCreditRoute)

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
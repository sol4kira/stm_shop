const db = require('../Config/db');

//Create purchase record
const createPurchase = async (req,res)=>{
    const {items,payment,supplierId,credit} = req.body;
    const connection = await db.getConnection();

    try{
        await connection.beginTransaction();

        const [purchaseResult] = await connection.query(
            'INSERT INTO purchase(purchaseTotalAmount,supplierId) VALUES (?,?)',
            [0,supplierId]
        );

        const purchaseId = purchaseResult.insertId;

        let totalAmount = 0;

        for(const item of items ){
            const itemTotal = item.purchasePrice * item.quantity
            totalAmount += itemTotal;

            await connection.query(
                'INSERT INTO purchase_item(purchasePrice, quantity,productId,purchaseId) VALUES(?,?,?,?)',
                [item.purchasePrice,item.quantity,item.productId, purchaseId]
            );

            await connection.query(
                'UPDATE product SET productQuantity = productQuantity + ?, isActive = 1 WHERE productId = ?',
                [item.quantity, item.productId]
            );

        }
        await connection.query(
            'UPDATE purchase SET purchaseTotalAmount =? WHERE purchaseId =?',
            [totalAmount,purchaseId]
        );

        await connection.query(
            'INSERT INTO purchase_payment(purchasePaymentType,purchasePaymentAmount,purchaseId) VALUES (?,?,?)',
            [payment.purchasePaymentType, payment.purchasePaymentAmount,purchaseId]
        );

        //insert Purchase Credit
        if (payment.purchasePaymentType === 'credit') {
            try {
                await connection.query(
                    'INSERT INTO purchase_credit(purchaseCreditAmount, purchaseCreditDueDate, purchaseId, supplierId) VALUES (?,?,?,?)',
                    [credit.purchaseCreditAmount, credit.purchaseCreditDueDate, purchaseId, supplierId]
                );
            } catch(creditError) {
                throw creditError;
            }
        }

        await connection.commit();
        res.status(201).json({message:"Purchase have been recorded successfully",purchaseId})
    }catch(error){
        await connection.rollback();
        res.status(500).json({message:"Purchase failed",error:error.message});
    }finally{
        connection.release();
    }
};

//Get all purchase
const getAllPurchase = async(req,res)=>{
    try{
        const [rows]= await db.query(
            `SELECT p.purchaseId ,
                DATE_FORMAT(p.purchaseDate,'%Y-%m-%d') AS purchaseDate,
                TIME_FORMAT(p.purchaseDate,'%H:%i:%s') AS purchaseTime,
                p.purchaseTotalAmount, 
                p.supplierId,
                pp.purchasePaymentType
            FROM purchase p
            LEFT JOIN purchase_payment pp on p.purchaseId = pp.purchaseId`
        );

        if(rows.length === 0){
            return res.status(404).json({message:'Purchase not found'});
        }
        res.status(200).json(rows);
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message});
    }
};

//Get purchase id including items and payments
const getPurchaseById = async (req,res)=>{
    const {id} = req.params;

    try{
        const [purchase] = await db.query(
            `SELECT purchaseId ,
                DATE_FORMAT(purchaseDate,'%Y-%m-%d') AS purchaseDate,
                TIME_FORMAT(purchaseDate,'%H:%i:%s') AS purchaseTime,
                purchaseTotalAmount, 
                supplierId 
            from purchase WHERE purchaseId = ? `,[id]
        );

        if(purchase.length === 0){
            return res.status(404).json({message:'Purchase not found.'});
        }

        const [items] = await db.query(
            'SELECT * FROM purchase_item WHERE purchaseId =?',[id]
        );

        const [payment] = await db.query(
            'SELECT * FROM purchase_payment WHERE purchaseId = ?', [id]
        );

        res.status(200).json({
            purchase,
            items,
            payment
        });
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message})
    }
};
// deadline
const getNearestSupplierCreditDeadline = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT purchaseCreditId, purchaseCreditDueDate, purchaseCreditAmount
             FROM purchase_credit
             WHERE purchaseCreditAmount > 0
             ORDER BY purchaseCreditDueDate ASC
             LIMIT 1`
        );
        res.status(200).json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createPurchase,getAllPurchase,getPurchaseById,getNearestSupplierCreditDeadline
};

const db =require('../Config/db');

//Get all Purchase Credit
const  getPurchaseCredit = async(req,res)=>{

    try{
        const [rows] = await db.query(
            `SELECT purchaseCreditId,
                purchaseCreditAmount,
                DATE_FORMAT(purchaseCreditDueDate, '%Y-%m-%d') AS purchaseDate,
                purchaseId,
                supplierId
            FROM purchase_credit`
        );

        if(rows.length === 0){
            return res.status(404).json({message:'Purchase Credit not found'});
        }
        res.status(200).json(rows);
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message});
    }
};

// Get Purchase credit by id
const getPurchaseCreditById = async(req, res)=>{
    const {id} = req.params;

    try{
        const [rows] = await db.query(
            `SELECT purchaseCreditId,
                purchaseCreditAmount,
                DATE_FORMAT(purchaseCreditDueDate, '%Y-%m-%d') AS purchaseCreditDate,
                purchaseId,
                supplierId
            FROM purchase_credit WHERE purchaseCreditId =?`,[id]
        );
        if(rows.length === 0){
            return res.status(404).json({message:'Purchase Credit not found.'});
        }

        res.status(200).json({rows});
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message})
    }
};

// Get Purchase Credit by supplier id 
const getPurchaseCreditBySupplierId = async(req, res)=>{
    const {supplierId} = req.params;

    try{
        const [rows] = await db.query(
            `SELECT 
                purchaseCreditId,
                purchaseCreditAmount,
                DATE_FORMAT(purchaseCreditDueDate, '%Y-%m-%d') AS purchaseCreditDate,
                purchaseId,
                supplierId
            FROM purchase_credit WHERE supplierId=?`,[supplierId]
        );
        if(rows.length === 0){
            return res.status(404).json({message:'Purchase Credit not found.'});
        }

        res.status(200).json({rows});
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message})
    }
};

//Credit Payment Made 
const createPurchaseCreditPayment = async (req, res) => {
    
    const { creditId } = req.params;
    const { purchaseCreditPaymentAmount } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // Step 1: Check if credit exists
        const [creditRows] = await connection.query(
            'SELECT purchaseCreditAmount FROM purchase_credit WHERE purchaseCreditId = ?', [creditId]
        );

        if (creditRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Purchase credit not found' });
        }

        // Step 2: Check if already fully paid
        if (creditRows[0].purchaseCreditAmount <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'This credit is already fully paid' });
        }

        // Step 3: Validate payment amount
        if (
            purchaseCreditPaymentAmount === undefined ||
            purchaseCreditPaymentAmount === null ||
            purchaseCreditPaymentAmount <= 0
        ) {
            await connection.rollback();
        
            return res.status(400).json({
                message: 'Payment amount must be greater than 0'
            });
        }

        // Step 4: Calculate remaining amount
        let finalAmount;
        if(purchaseCreditPaymentAmount<=creditRows[0].purchaseCreditAmount){
        finalAmount = creditRows[0].purchaseCreditAmount - purchaseCreditPaymentAmount;
        }else{
            await connection.rollback();
            return res.status(400).json({message:"The payment amount can't be greater than the the remaining amount "})
        }

        // Step 5: Insert payment record
        await connection.query(
            'INSERT INTO purchase_credit_payment(purchaseCreditPaymentAmount, purchaseCreditId) VALUES (?, ?)',
            [purchaseCreditPaymentAmount, creditId]
        );
        // Step 6: Update credit amount
        await connection.query(
            'UPDATE purchase_credit SET purchaseCreditAmount = ? WHERE purchaseCreditId = ?',
            [finalAmount, creditId]
        );
        await connection.commit();
        res.status(201).json({
            message: 'Payment recorded successfully',
            remainingAmount: finalAmount
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }finally{
        connection.release();
    }
};

const getPurchaseCreditPayments = async(req, res) => {
    const {creditId} = req.params;
    try {
        const [payments] = await db.query(
            `SELECT 
                purchaseCreditPaymentId,
                purchaseCreditPaymentAmount,
                DATE_FORMAT(purchaseCreditPaymentDate, '%Y-%m-%d') AS paymentDate
            FROM purchase_credit_payment 
            WHERE purchaseCreditId = ?`, [creditId]
        );
        res.status(200).json(payments);
    } catch(error) {
        res.status(500).json({message: 'Server error.', error: error.message});
    }
};

//get purchase credit top 5
const getDashboardSupplierCredit = async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT s.supplierName,pc.purchaseCreditAmount,pc.purchaseCreditDueDate,pc.purchaseId
            FROM purchase_credit pc
            JOIN supplier s ON pc.supplierId = s.supplierId
            WHERE pc.purchaseCreditAmount > 0
            ORDER BY pc.purchaseCreditDueDate ASC
            LIMIT 5`
        );
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getPurchaseCredit,getPurchaseCreditById,getPurchaseCreditBySupplierId,createPurchaseCreditPayment,getPurchaseCreditPayments,getDashboardSupplierCredit
};
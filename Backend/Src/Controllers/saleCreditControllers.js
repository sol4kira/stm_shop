const db =require('../Config/db');

//Get all sale Credit
const  getSaleCredit = async(req,res)=>{

    try{
        const [rows] = await db.query(
            `SELECT saleCreditId,
                saleCreditAmount,
                DATE_FORMAT(saleCreditDueDate, '%Y-%m-%d') AS saleDate,
                saleId,
                customerId
            FROM sale_credit`
        );

        if(rows.length === 0){
            return res.status(404).json({message:'Sale Credit not found'});
        }
        res.status(200).json(rows);
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message});
    }
};

// Get sale credit by id
const getSaleCreditById = async(req, res)=>{
    const {id} = req.params;

    try{
        const [rows] = await db.query(
            `SELECT saleCreditId,
                saleCreditAmount,
                DATE_FORMAT(saleCreditDueDate, '%Y-%m-%d') AS saleCreditDate,
                saleId,
                customerId
            FROM sale_credit WHERE saleCreditId =?`,[id]
        );
        if(rows.length === 0){
            return res.status(404).json({message:'Sale Credit not found.'});
        }

        res.status(200).json({rows});
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message})
    }
};

// Get sale Credit by Customer id 
const getSaleCreditByCustomerId = async(req, res)=>{
    const {customerId} = req.params;

    try{
        const [rows] = await db.query(
            `SELECT 
                saleCreditId,
                saleCreditAmount,
                DATE_FORMAT(saleCreditDueDate, '%Y-%m-%d') AS saleCreditDate,
                saleId,
                customerId
            FROM sale_credit WHERE customerId=?`,[customerId]
        );
        if(rows.length === 0){
            return res.status(404).json({message:'sale Credit not found.'});
        }

        res.status(200).json({rows});
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message})
    }
};

const getSaleCreditPayments = async(req, res) => {
    const {creditId} = req.params;
    try {
        const [payments] = await db.query(
            `SELECT 
                saleCreditPaymentId,
                saleCreditPaymentAmount,
                DATE_FORMAT(saleCreditPaymentDate, '%Y-%m-%d') AS paymentDate
            FROM sale_credit_payment 
            WHERE saleCreditId = ?`, [creditId]
        );
        res.status(200).json(payments);
    } catch(error) {
        res.status(500).json({message: 'Server error.', error: error.message});
    }
};

//Credit Payment Made 
const createSaleCreditPayment = async (req, res) => {
    const {creditId } = req.params;
    const { saleCreditPaymentAmount } = req.body;

    try {
        const [saleRows] = await db.query(
            'SELECT saleCreditAmount FROM sale_credit WHERE saleCreditId = ?', [creditId]
        );

        if (saleRows.length === 0) {
            return res.status(404).json({ message: 'sale credit not found' });
        }
        if (saleRows[0].saleCreditAmount <= 0) {
            return res.status(400).json({ message: 'This credit is already fully paid' });
        }

        if (!saleCreditPaymentAmount) {
            return res.status(400).json({ message: 'Payment amount is required' });
        }

        const finalAmount = saleRows[0].saleCreditAmount - saleCreditPaymentAmount;

        await db.query(
            'INSERT INTO sale_credit_payment(saleCreditPaymentAmount, saleCreditId) VALUES (?, ?)',
            [saleCreditPaymentAmount, creditId]
        );
        await db.query(
            'UPDATE sale_credit SET saleCreditAmount = ? WHERE saleCreditId = ?',
            [finalAmount, creditId]
        );

        res.status(201).json({
            message: 'Payment recorded successfully',
            remainingAmount: finalAmount
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//get sell credit top 5
const getDashboardCustomerCredit = async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT c.customerName,sc.saleCreditAmount,sc.saleCreditDueDate,sc.saleId
            FROM sale_credit sc
            JOIN customer c ON sc.customerId = c.customerId
            WHERE sc.saleCreditAmount > 0
            ORDER BY sc.saleCreditDueDate ASC
            LIMIT 5`
        );
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getSaleCredit,getSaleCreditById,getSaleCreditByCustomerId,createSaleCreditPayment,getSaleCreditPayments,getDashboardCustomerCredit
};
const db = require('../Config/db');

//create sale records
const createSale = async(req,res)=>{
    const {customerId, items,payment,credit} = req.body;
    const connection = await db.getConnection();

    try{
        await connection.beginTransaction();

        const [saleResult] = await connection.query(
            'INSERT INTO sale (saleTotalAmount,customerId) VALUES (?,?)',
            [0,customerId]
        );

        const saleId = saleResult.insertId;

        let totalAmount = 0;

        for(const item of items){
            const itemTotal = item.salePrice * item.quantity
            totalAmount += itemTotal;

            await connection.query(
                'INSERT INTO sale_item(salePrice,quantity,productId,saleId) VALUES (?,?,?,?)',
                [item.salePrice,item.quantity,item.productId,saleId]
            );

            await connection.query(
                'UPDATE product SET productQuantity = productQuantity - ?, isActive = IF(productQuantity - ? <= 0, 0, 1) WHERE productId = ?',
                [item.quantity, item.quantity, item.productId]
            );
        }

        await connection.query(
            'UPDATE sale SET saleTotalAmount = ? WHERE saleId = ?',[totalAmount,saleId]
        );
        await connection.query(
            'INSERT INTO sale_payment(salePaymentType,salePaymentAmount,saleId) VALUES(?,?,?)',
            [payment.salePaymentType,payment.salePaymentAmount,saleId]
        );
        //insert Sale Credit
        if (payment.salePaymentType === 'credit') {
            await connection.query(
            'INSERT INTO sale_credit(saleCreditAmount, saleCreditDueDate, saleId, customerId) VALUES (?,?,?,?)',
            [credit.saleCreditAmount, credit.saleCreditDueDate, saleId, customerId]
        );
        }
        await connection.commit();
        res.status(201).json({message:"Sale have been recorded successfully",saleId})
    }catch(error){
        await connection.rollback();
        res.status(500).json({message:"Sale failed",error:error.message});
    }finally{
        connection.release();
    }
};

//Get all sales
const getAllSale = async(req,res)=>{

    try{
        const [rows] = await db.query(
            `SELECT s.saleId,
                DATE_FORMAT(s.saleDate,'%Y-%m-%d') AS saleDate,
                TIME_FORMAT(s.saleDate,'%H:%i:%s') AS saleTime,
                s.saleTotalAmount, 
                s.customerId,
                sp.salePaymentType
            FROM sale s
            LEFT JOIN sale_payment sp ON s.saleId = sp.saleId`
        );

    if(rows.length === 0){
        return res.status(404).json({message:'Sales not found.'});
    }

    res.status(200).json(rows);
    }catch(error){
        res.status(500).json({message:'Server error',error:error.message});
    }
};

//Get sale by id including items and payments
const getSaleById = async (req,res)=>{
    const {id} = req.params;

    try{
        const [sales] = await db.query(
            `SELECT saleId,
                DATE_FORMAT(saleDate,'%Y-%m-%d') AS saleDate,
                TIME_FORMAT(saleDate,'%H:%i:%s') AS saleTime,
                saleTotalAmount, 
                customerId  
            from sale WHERE saleId = ? `,[id]
        );

        if(sales.length === 0){
            return res.status(404).json({message:'Sales not found.'});
        }

        const [items] = await db.query(
            'SELECT * FROM sale_item WHERE saleId =?',[id]
        );

        const [payment] = await db.query(
            'SELECT * FROM sale_payment WHERE saleId = ?', [id]
        );

        res.status(200).json({
            sales,
            items,
            payment
        });
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message})
    }
};

//today's total sale
const getDashboardSalesTotal = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT COALESCE(SUM(saleTotalAmount), 0) AS todaysSalesTotal
            FROM sale
            WHERE DATE(saleDate) = CURDATE()`
        );
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Sales report summary
const getSalesSummary = async (req, res) => {
    const { from, to } = req.query;
    try {
        const [result] = await db.query(
            `SELECT COALESCE(SUM(saleTotalAmount), 0) AS totalAmount,
                    COUNT(*) AS totalCount
             FROM sale
             WHERE DATE(saleDate) BETWEEN ? AND ?`,
            [from, to]
        );
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Sales report detail
const getSalesDetails = async (req, res) => {
    const { from, to, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const [rows] = await db.query(
            `SELECT s.saleId, s.saleTotalAmount, s.saleDate,ss.salePaymentType, c.customerName
             FROM sale s
             LEFT JOIN sale_payment ss on s.saleId = ss.saleId
             LEFT JOIN customer as c on s.customerId = c.customerId
             WHERE DATE(saleDate) BETWEEN ? AND ?
             ORDER BY saleDate DESC
             LIMIT ? OFFSET ?
             `,
            [from, to, Number(limit), Number(offset)]
        );
        const [countResult] = await db.query(
            `SELECT COUNT(*) AS totalRows
             FROM sale s
             WHERE DATE(s.saleDate) BETWEEN ? AND ?`,
            [from, to]
        );
        res.status(200).json({
            rows,
            totalRows: countResult[0].totalRows,
            totalPages: Math.ceil(countResult[0].totalRows / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createSale,getAllSale,getSaleById,getDashboardSalesTotal,getSalesDetails,getSalesSummary
};



const db = require('../Config/db.js')

//Get all customer
const getCustomer = async(req,res)=>{
    try{
        const [rows]= await db.query(
           ' SELECT * FROM customer'
        )
        res.status(200).json(rows)
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message})
    }
};

//Get customer by id
const getCustomerById = async(req,res)=>{
    try{
        const {id} = req.params;
    const [rows] = await db.query(
        'SELECT * FROM customer WHERE customerId=?',[id]
    );

    if(rows.length === 0){
        res.status(404).json({message:'Customer not found'});
    }
    res.status(200).json(rows[0])
    }catch(error){
        res.status(500).json({message:'Server error',error:error.message})
    }
};

//Get customer by name
const getCustomerByName = async(req,res)=>{
    try{
        const {name} = req.params;
        const [rows] = await db.query(
        'SELECT * FROM customer WHERE customerName=?',[name]
    );

    if(rows === 0){
        res.status(404).json({message:'Customer not found'});
    }
    res.status(200).json(rows[0])
    }catch(error){
        res.status(500).json({message:'Server error',error:error.message})
    }
};

//Create new customer
const createCustomer = async(req,res)=>{

    try{
        const{
            customerId,customerName,customerPhoneNumber,
        }= req.body

        if(!customerId|| !customerName || !customerPhoneNumber){
            return res.status(400).json({message:'Required filled are not filled'});
        }

        const[result] = await db.query(
            'INSERT INTO customer(customerId,customerName,customerPhoneNumber) VALUES(?,?,?)',
            [customerId,customerName,customerPhoneNumber]
        );
        res.status(201).json({message:'New Customer have been added, customerId: result.insertId'});
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message});
    }
};

//Update customer information 
const updateCustomer = async(req,res)=>{
    try{
        const{id} = req.params;
        const {
            customerName,customerPhoneNumber
        }=req.body;
        const [result] = await db.query(
            'UPDATE customer SET customerName = ?, customerPhoneNumber = ? WHERE customerId=?',
            [customerName,customerPhoneNumber,id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message:'Supplier Not found'});
        }
        res.status(200).json({message:'Customer information have been updated. '})
    }catch(error){
        res.status(500).json({message:'Server Error',error: error.message});
    }
};

//Delete customer Information
const deleteCustomer= async(req,res)=>{
    try{
        const {id} = req.params
        const[result] = await db.query(
            'DELETE FROM customer WHERE customerId =?',[id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message:'Customer not found'});
        }
        res.status(200).json({message:'Supplier have been deleted successfully'});
    }catch(error){
        res.status(500).json({message:'Server error',error: error.message});
    }
};

module.exports = {
    getCustomer,getCustomerById,getCustomerByName,createCustomer,updateCustomer,deleteCustomer
}
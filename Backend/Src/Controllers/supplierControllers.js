const db = require('../Config/db')

//Get All Suppliers 
const getAllSuppliers = async(req,res) => {

    try{
        const[rows] = await db.query('SELECT * FROM supplier') 
        res.status(200).json(rows)
    }catch(error){
        res.status(500).json({message:'Server error', error: error.message});

    }
};

//Get Supplier By Id
const getSupplierById = async(req,res) => {
    
    try{
        const {id} = req.params;
        const [rows] = await db.query(
            'SELECT * FROM supplier WHERE supplierId = ?',[id]
        );

        if(rows.length === 0){
            return res.status(404).json({message:'Supplier not Found'});
        }
        res.status(200).json(rows[0]);
    }catch(error){
        res.status(500).json({message:'Server error', error:error.message});
    }
};

//Get supplier by name
const getSupplierByName = async(req,res) => {
    
    try{
        const {name} = req.params;
        const [rows] = await db.query(
            'SELECT * FROM supplier WHERE supplierName = ?',[name]
        );

        if(rows.length === 0){
            return res.status(404).json({message:'Supplier not Found'});
        }
        res.status(200).json(rows);
    }catch(error){
        res.status(500).json({message:'Server error', error:error.message});
    }
};

//Create new supplier
const createSupplier = async(req,res)=>{

    try{
        const{
            supplierName,supplierPhoneNumber,
        }= req.body

        if(!supplierName || !supplierPhoneNumber){
            return res.status(400).json({message:'Required filled are not filled'});
        }
        if(!/^\d{10}$/.test(supplierPhoneNumber)){
            return res.status(400).json({message:"Phone Number must be 10 digits"})
        }

        const[result] = await db.query(
            'INSERT INTO supplier(supplierName,supplierPhoneNumber) VALUES(?,?)',
            [supplierName,supplierPhoneNumber]
        );
        res.status(201).json({message:'New supplier have been added', supplier_id: result.insertId});
    }catch(error){
        res.status(500).json({message:'Server error.',error:error.message});
    }
};

//Update supplier information 
const updateSupplier = async(req,res)=>{
    try{
        const{id} = req.params;
        const {
            supplierName,supplierPhoneNumber
        }=req.body;
        const [result] = await db.query(
            'UPDATE supplier SET supplierName = ?, supplierPhoneNumber = ? WHERE supplierId=?',
            [supplierName,supplierPhoneNumber,id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message:'Supplier Not found'});
        }
        res.status(200).json({message:'Supplier information have been updated. '})
    }catch(error){
        res.status(500).json({message:'Server Error',error: error.message});
    }
};

//Delete Supplier Information
const deleteSupplier= async(req,res)=>{
    try{
        const {id} = req.params
        const[result] = await db.query(
            'DELETE FROM supplier WHERE supplierId =?',[id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message:'Supplier not found'});
        }
        res.status(200).json({message:'Supplier have been deleted successfully'});
    }catch(error){
        res.status(500).json({message:'Server error',error: error.message});
    }
};

module.exports = {
    getAllSuppliers,getSupplierById,getSupplierByName,createSupplier,updateSupplier,deleteSupplier
}
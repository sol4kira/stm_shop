const db = require('../Config/db')

//GET all
const getAllProducts = async(req, res)=>{
    try{
        const [rows] = await db.query('SELECT * FROM product')
        res.status(200).json(rows)
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

//GET one
const getProductById = async (req,res)=>{
    try{
        const {id} = req.params;
        const [rows] = await db.query(
            'SELECT * FROM Product WHERE ProductId = ?',[id]
        );  

        if(rows.length === 0){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json(rows[0]);

      } 
      catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
      }
};

//Create
const createProduct = async(req,res)=>{
    try{
        const {
            productName,productPurchasingPrice,productSellingPrice,color,productType,productQuantity,productDescription
        } = req.body;

        if(!productName || !productPurchasingPrice ===undefined || !productSellingPrice===undefined || !productQuantity===undefined ){
            return res.status(400).json({ message: 'Required filled must be filled'});
        }

        const [result] = await db.query(
            'INSERT INTO product (productName, productPurchasingPrice, productSellingPrice, color, productType, productQuantity, productDescription) VALUES (?,?,?,?,?,?,?)',
            [productName,productPurchasingPrice,productSellingPrice,color,productType,productQuantity,productDescription]
        );

         res.status(201).json({ message: 'Product created', product_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    };

}

//Update Product
const updateProduct = async(req,res)=>{
    try{
        const{id} = req.params;
        const {
            productName,productPurchasingPrice,productSellingPrice,color,productType,productQuantity,productDescription
        } = req.body;

        const [result] = await db.query(
            'UPDATE product SET productName=?, productPurchasingPrice=?, productSellingPrice=?, color=?, productType=?, productQuantity=?, productDescription=? WHERE productId=?',
            [productName, productPurchasingPrice, productSellingPrice, color, productType, productQuantity, productDescription, id]
        ); 

        if(result.affectedRows === 0){
            return res.status(404).json({message:'Product not found'});
        }

        res.status(200).json({ message: 'Product updated' });
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Delete
const deleteProduct = async(req,res)=>{
    try{
        const{id} = req.params;
        
        const [result] = await db.query(
            'DELETE FROM Product WHERE productId =?',
            [id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json({message:'Product Deleted.'});
    }catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
//low stack
const getLowStockProducts = async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT productName, productType, productQuantity, productSellingPrice
            FROM product
            WHERE productQuantity < 10
            ORDER BY productQuantity ASC
            LIMIT 5`
        );
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct,getLowStockProducts}
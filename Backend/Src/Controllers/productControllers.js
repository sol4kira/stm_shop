const db = require('../Config/db')

//GET all
const getAllProducts = async(req, res)=>{
    try{
        const [rows] = await db.query('SELECT * FROM product')
        res.status(200).json(rows)
    }catch (err) {
  console.error(err);
  res.status(500).json({message:"Product failed to retreive",error:error.message});
}
};

//GET one by id
const getProductById = async (req,res)=>{
    try{
        const {id} = req.params;
        const [rows] = await db.query(
            'SELECT * FROM Product WHERE productId = ?',[id]
        );  

        if(rows.length === 0){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json(rows[0]);

      } 
      catch (err) {
  console.error(err);
  res.status(500).json({message:"Product failed to retreive.",error:error.message});
}
};

//Create
const createProduct = async(req,res)=>{
    try{
        const {
            productName,productPurchasingPrice,productSellingPrice,color,productType,productQuantity,productDescription
        } = req.body;

        if (
            productPurchasingPrice < 0 ||
            productSellingPrice < 0 ||
            productQuantity < 0
        ) {
            return res.status(400).json({
                message: 'Prices and quantity cannot be negative'
            });
        }

        const [result] = await db.query(
            'INSERT INTO product (productName, productPurchasingPrice, productSellingPrice, color, productType, productQuantity, productDescription, isActive) VALUES (?,?,?,?,?,?,?,?)',
            [productName, productPurchasingPrice, productSellingPrice, color, productType, productQuantity, productDescription, productQuantity > 0 ? 1 : 0]
        );

         res.status(201).json({ message: 'Product created', product_id: result.insertId });
    } catch (err) {
  console.error(err);
  res.status(500).json({message:"Product failed to create",error:error.message});
}

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
    } catch (err) {
  console.error(err);
  res.status(500).json({message:"Product failed",error:error.message});
}
};

//Delete
const deleteProduct = async(req,res)=>{
    try{
        const{id} = req.params;
        
        const [result] = await db.query(
            'DELETE FROM product WHERE productId =?',
            [id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json({message:'Product Deleted.'});
    }catch (err) {
  console.error(err);
  res.status(500).json({message:"Product failed",error:error.message});
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
    }catch (err) {
  console.error(err);
  res.status(500).json({message:"Product failed",error:error.message});
}
};


module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct,getLowStockProducts}
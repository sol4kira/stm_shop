import { useState,useEffect } from "react"
import products from "./product.module.css"
import { FaTimes } from "react-icons/fa";
import { API_URL } from "../../client";

function Products(){
   const [product, setProduct] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredBy, setFilteredBy] = useState("date")
   const [selectedProduct, setSelectedProduct] = useState(null)
   const [editData, setEditData] = useState(null)
   const [deleteError, setDeleteError] = useState("")
   const [showAddModel, setShowAddModel] = useState(false)
   const [newProduct,setNewProduct] = useState({
    productName:"",
    productType:"",
    productPurchasingPrice:"",
    productSellingPrice:"",
    productQuantity:"",
    productDescription:""
   })
   
const [loading, setLoading] = useState(true);

    const fetchProducts = () => {
                                    fetch(`${API_URL}/api/products`)
                                    .then(response => response.json())
                                    .then(data => {setProduct(data);
                                        setLoading(false);
                                    });
                                };

    useEffect(() => {
        fetchProducts();
        }, []);
        
        if (loading) {
    return <div>Loading...</div>;
    }

    const sortedProducts = [...product].sort((a, b) => {
        if (filteredBy === "name") {
          return a.productName.localeCompare(b.productName);
        } else if (filteredBy === "selling-price") {
          return a.productSellingPrice - b.productSellingPrice;
        } else if (filteredBy === "purchase-price") {
          return a.productPurchasingPrice - b.productPurchasingPrice;
        }
    return 0;
    });
   
    return(
        <div>
            <div className={products.top}>
                <h1 className={products.title}>Products</h1>
                <button type="button" className={products.addButton} onClick={()=>{setShowAddModel(true)}}>+  ADD Product</button>
                    {showAddModel && (
                    <div className={products.overlay}>
                        <div className={products.model}>
                            <button type="button" onClick={() => {
                                setShowAddModel(false);
                                setNewProduct({
                                    productName: "",
                                    productType: "",
                                    productPurchasingPrice: "",
                                    productSellingPrice: "",
                                    productQuantity: "",
                                    color: "",
                                    productDescription: ""
                                });
                            }} className={products.closeBtn}>
                                <FaTimes/>
                            </button>
                            <label htmlFor="Name">Product Name</label>
                            <input value={newProduct.productName} onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})} />

                            <label htmlFor="type">Type</label>
                            <input value={newProduct.productType} onChange={(e) => setNewProduct({...newProduct, productType: e.target.value})}/>

                            <label htmlFor="purchasing-price">Purchasing Price</label>
                            <input value={newProduct.productPurchasingPrice} onChange={(e) => setNewProduct({...newProduct, productPurchasingPrice: e.target.value})}/>

                            <label htmlFor="selling-price">Selling Price</label>
                            <input value={newProduct.productSellingPrice} onChange={(e) => setNewProduct({...newProduct, productSellingPrice: e.target.value})}/>

                            <label htmlFor="quantity">Quantity</label>
                            <input value={newProduct.productQuantity} onChange={(e) => setNewProduct({...newProduct, productQuantity: e.target.value})}/>
                            
                            <label htmlFor="color">Color</label>
                            <input value={newProduct.color} onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}/>

                            <label htmlFor="description">Product Description</label>
                            <textarea value={newProduct.productDescription} onChange={(e) => setNewProduct({...newProduct, productDescription: e.target.value})}/>

                            <button type="submit" className={products.submit} onClick={()=>{
                                fetch(`${API_URL}/api/products`,{
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newProduct)
                                })
                                .then(res => res.json())
                                .then(data => {
                                setShowAddModel(false)
                                setNewProduct({
                                productName: "",
                                productType: "",
                                productPurchasingPrice: "",
                                productSellingPrice: "",
                                productQuantity: "",
                                color:"",
                                productDescription: ""
                                });
                                fetchProducts();
                                })
                            }}>Save</button>
                        </div>
                    </div> 
                    )}   
            </div>

            <div className={products.adjust}>
                <input type="text" placeholder="Search..." className={products.search} onChange={(e)=>setSearchTerm(e.target.value)}/>
                <select className={products.filter} onChange={(e)=>setFilteredBy(e.target.value)}>
                    <option value="">--Select--</option>
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                    <option value="selling-price">Selling Price</option>
                    <option value="purchase-price">Purchase Price</option>
                    <option value="isActive">Is Active</option>
                </select>
            </div>    
            <table className={products.table}>
                <thead className={products.header}>
                    <tr>
                        <th className={products.names}>Name</th>
                        <th className={products.names}>Purchasing Price</th>
                        <th className={products.names}>Selling Price</th>
                        <th className={products.names}>Color</th>
                        <th className={products.names}>Product Type</th>
                        <th className={products.names}>Product Quantity</th>
                        <th className={products.names}>Product Description</th>
                    </tr>
                </thead>
                <tbody className={products.body}>
                    {sortedProducts.filter(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item=>(
                    <tr key={item.productId} onClick={() => { setSelectedProduct(item);setEditData(item);}}>
                    <td className={products.att}>{item.productName}</td>
                    <td className={products.att}>{item.productPurchasingPrice}</td>
                    <td className={products.att}>{item.productSellingPrice}</td>
                    <td className={products.att}>{item.color}</td>
                    <td className={products.att}>{item.productType}</td>
                    <td className={products.att}>{item.productQuantity}</td>
                    <td className={products.att}>{item.productDescription}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            {
                selectedProduct && (
                    <div className={products.overlay}>
                        <div className={products.model}>
                            <button type="close" onClick={() => setSelectedProduct(null)}  className={products.closeBtn}>
                                <FaTimes/>
                            </button>
                            <label htmlFor="Name">Product Name</label>
                            <input value={editData.productName} onChange={(e) => setEditData({...editData, productName: e.target.value})} />

                            <label htmlFor="type">Type</label>
                            <input value={editData.productType} onChange={(e) => setEditData({...editData, productType: e.target.value})} />

                            <label htmlFor="purchasing-price">Purchasing Price</label>
                            <input value={editData.productPurchasingPrice} onChange={(e) => setEditData({...editData, productPurchasingPrice: e.target.value})} />

                            <label htmlFor="selling-price">Selling Price</label>
                            <input value={editData.productSellingPrice} onChange={(e) => setEditData({...editData, productSellingPrice: e.target.value})} />

                            <label htmlFor="quantity">Quantity</label>
                            <input value={editData.productQuantity} onChange={(e) => setEditData({...editData, productQuantity: e.target.value})} />
                            
                            <label htmlFor="color">Color</label>
                            <input value={editData.color} onChange={(e) => setEditData({...editData, color: e.target.value})} />

                            {deleteError && <p style={{ color: "#E53935", fontSize: "14px" }}>{deleteError}</p>}

                            <div className={products.modelButton}>
                                <button type="submit"className={products.submit} 
                                        onClick={() => {
                                        fetch(`${API_URL}/api/products/${editData.productId}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(editData)
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            setSelectedProduct(null)
                                            fetchProducts();
                                        })
                                        }}>
                                        Edit</button>
                                <button type="submit" className={products.delete}
                                onClick={()=>{
                                    setDeleteError("This product cannot be deleted because it has purchase or sales history.")
                                }}
                                >Delete</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Products
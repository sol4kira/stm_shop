import { useState,useEffect } from "react"
import styles from "./product.module.css"
import purchaseStyle from "./sales.module.css"
import { FaTimes } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

function Purchase(){
    const [purchase,setPurchase] = useState([]);
    const [items, setItems] = useState([{ productId: "", quantity: "", purchasePrice: "" }]);
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");
    const [selectedPurchase, setSelectedPurchase] = useState(null)
    const [filteredBy,setFilteredBy] = useState("")
    const [showAddModel, setShowAddModel] = useState(false);
    const [supplierId, setSupplierId] = useState("");
    const [product, setProduct] = useState([]);
    const [payment, setPayment] = useState({
        purchasePaymentType: "cash",
        purchasePaymentAmount: ""
    });
    const [newProduct, setNewProduct] = useState({
    productName: "",
    color: "",
    productType: "",
    productDescription: "",
    productPurchasingPrice: 0,
    productSellingPrice: 0,
    productQuantity: 0
    });
    const [supplier, setSupplier] = useState([]);
    const [newSupplier,setNewSupplier]=useState({
        supplierName:"",
        supplierPhoneNumber:""
    })
    const fetchSales=(() =>{
        fetch("http://localhost:3000/api/purchase")
            .then(res => res.json())
            .then(data => setPurchase(data));
    })

    useEffect(() => {
        fetchSales();
    fetch("http://localhost:3000/api/supplier")
        .then(res => res.json())
        .then(data => setSupplier(data));

    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => setProduct(data));

    }, []);
    
    //sort sales
    const purchaseWithName = purchase.map(s => ({
    ...s,
    supplierName: supplier.find(c => c.supplierId === s.supplierId)?.supplierName || "Unknown"
    }));
    
    const sortedPurchase = [...purchaseWithName].sort((a, b) => {
        if (filteredBy === "Date") {
            return a.purchaseDate.localeCompare(b.purchaseDate);
        } else if (filteredBy === "Total Amount") {
            return a.purchaseTotalAmount - b.purchaseTotalAmount;
        } else if (filteredBy === "supplier name") {
            return a.supplierName.localeCompare(b.supplierName);
        }
        return (b.purchaseDate + b.purchaseTime).localeCompare(a.purchaseDate + a.purchaseTime);
    });

    //add empty item row
    const addItem = () => {setItems([...items, { productId: "", quantity: "", purchasePrice: "" }]);};

    //to update specific items
    const updateItem = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };
    //credit 2 week period
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 14);
    const dueDateFormatted = dueDate.toISOString().split('T')[0];
    // total amount of all the purchase items
    const totalAmount = items.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);

    //the req.body fot the save
    const purchaseData = {
    supplierId: parseInt(supplierId),
    items: items,
    payment: payment,
    credit: {
        purchaseCreditAmount: totalAmount-payment.purchasePaymentAmount,
        purchaseCreditDueDate: dueDateFormatted,
    }
    };
    //give total purchase amount
    const totalPurchaseAmount = items.reduce((sum, item) => sum + (parseFloat(item.purchasePrice || 0) * parseFloat(item.quantity || 0)), 0);
    const hasPaymentError = parseFloat(payment.purchasePaymentAmount || 0) !== totalPurchaseAmount && payment.purchasePaymentType !== "credit";
    const hasSupplierError = !supplierId
    return(
            <div>
                <div className={styles.top}>
                    <h1 className={styles.title}>Purchase</h1>
                    <button type="button" className={styles.addButton} onClick={()=>{setShowAddModel(true)}}>+  New Purchase</button>
                    {showAddModel && (
                    <div className={styles.overlay}>
                        <div className={purchaseStyle.model}>
                            <button type="button" onClick={() => {
                                setShowAddModel(false);
                                setItems([{ productId: "", quantity: "", purchasePrice: "" }]);
                                    }} className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            {items.map((item, index) => (
                                <div key={index} className={purchaseStyle.itemRow}>
                                    <div className={purchaseStyle.deleteButton} >
                                    <p>Item {index+1}</p>
                                    {index > 0 && (
                                        <button className={purchaseStyle.deleteIcon} type="button" onClick={() => {
                                            const updatedItems = items.filter((_, i) => i !== index);
                                            setItems(updatedItems);
                                        }}><FaTrash /></button>
                                    )}
                                    </div>
                                    <div className={purchaseStyle.field}>
                                    <label htmlFor="productId">Product</label>
                                    <select name="product" id="SelectProduct"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        updateItem(index, "productId", value);
                                        if (value !== "newProducts") {
                                            const selected = product.find(p => p.productId === parseInt(value));
                                            if (selected) updateItem(index, "purchasePrice", selected.productPurchasingPrice);
                                        }
                                    }}>
                                    <option>--Select--</option>
                                    {product.map(p => (
                                    <option key={p.productId} value={p.productId} 
                                    >{p.productName}</option>
                                    ))}
                                    <option value="newProducts">+ New Product</option>
                                    </select>
                                    {item.productId === "newProducts" &&(
                                        <div className={purchaseStyle.addNew}>
                                            <label htmlFor="productName">Product Name</label>
                                            <input type="text" value={newProduct.productName} onChange={(e)=>setNewProduct({...newProduct, productName: e.target.value})}/>

                                            <label htmlFor="color">Product Color</label>
                                            <input type="text" value={newProduct.color} onChange={(e)=>setNewProduct({...newProduct, color: e.target.value})} />

                                            <label htmlFor="productType">Product Type</label>
                                            <input type="text" value={newProduct.productType} onChange={(e)=>setNewProduct({...newProduct, productType: e.target.value})} />

                                            <label htmlFor="productDescription">Product Description</label>
                                            <textarea name="productDescription" value={newProduct.productDescription} onChange={(e)=>setNewProduct({...newProduct, productDescription: e.target.value})}></textarea>
                                                <button type="button" className={styles.addButton} onClick={() => {
                                                    fetch("http://localhost:3000/api/products", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify(newProduct)
                                                    })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        updateItem(index, "productId", data.product_id);
                                                        // refresh product list
                                                        fetch("http://localhost:3000/api/products")
                                                            .then(res => res.json())
                                                            .then(data => setProduct(data));
                                                    })
                                                }}>Save Product</button>
                                            </div>
                                    )}
                                    </div>
                                    <div className={purchaseStyle.field}>
                                    <label htmlFor="quantity">Quantity</label>
                                    <input 
                                    value={item.quantity} 
                                    onChange={(e) => updateItem(index, "quantity", e.target.value)} 
                                    className={purchaseStyle.lables}/>
                                    
                                    </div>
                                {/*this should be inserted when choosing product but it will allow editing but show warning if we decrease more than the actual purchasing price */}
                                    <div className={purchaseStyle.field}>
                                    <label htmlFor="purchasePrice">Purchasing Price</label>
                                    <input 
                                    value={item.purchasePrice} 
                                    onChange={(e) => updateItem(index, "purchasePrice", e.target.value)} 
                                    />
                                    </div>
                                </div>
                                ))}
                                <label htmlFor="total">Total Amount</label>
                                <p>The Total amount is {totalPurchaseAmount}</p>
                                {/* if payment method is set to credit this can be allowed to be 0 and less than the selling price but if not the actual price must be payed. */}
                                <label htmlFor="amountPayed">Purchase Payment Amount</label>
                                <input value={payment.purchasePaymentAmount}onChange={(e) => setPayment({...payment, purchasePaymentAmount: e.target.value})}/>
                                <label htmlFor="paymentMethod">Choose Payment Method</label>
                                <select value={payment.purchasePaymentType} onChange={(e)=>setPayment({...payment,purchasePaymentType: e.target.value})}>
                                    <option value="cash"defaultChecked>Cash</option>
                                    <option value="mobile">Mobile Banking</option>
                                    <option value="credit">Credit</option>
                                </select>
                                    {hasPaymentError && (
                                        <p style={{ color: "#E53935", fontSize: "12px" }}>
                                            Warning: Payment amount doesn't match total. Set payment method to Credit.
                                        </p>
                                    )}
                                <label htmlFor="supplier">
                                    Insert supplier
                                </label>
                                <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                                    <option value="">--Select Supplier--</option>
                                    {supplier.map(c => (
                                        <option key={c.supplierId} value={c.supplierId}>{c.supplierName}</option>
                                    ))}
                                    <option value="newSupplier">+ New Supplier</option>
                                </select>
                                {
                                    supplierId ==="newSupplier" &&(
                                        <div className={purchaseStyle.addNew}>
                                            <label htmlFor="name">Supplier Name</label>
                                            <input type="text" value={newSupplier.supplierName} onChange={(e)=> setNewSupplier({...newSupplier,supplierName: e.target.value})}/>
                                            <label htmlFor="name">Phone number</label>
                                            <input type="number" value={newSupplier.supplierPhoneNumber} onChange={(e)=>setNewSupplier({...newSupplier, supplierPhoneNumber: e.target.value})}/>

                                            <button type="submit"className={styles.addButton} onClick={() => {
                                                    fetch("http://localhost:3000/api/supplier", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify(newSupplier)
                                                    })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        setSupplierId(data.supplier_id);
                                                        fetch("http://localhost:3000/api/supplier")
                                                            .then(res => res.json())
                                                            .then(suppliers => setSupplier(suppliers));
                                                    })
                                                }}>save Supplier</button>
                                        </div>
                                    )
                                }
                                {hasSupplierError &&(
                                    <p style={{color:"#E53935", fontSize:"12px"}}>
                                        Warning:Every Purchase must have a Rejecter supplier
                                    </p>
                                )}

                            <div className={purchaseStyle.bot}>
                            <button type="button" className={purchaseStyle.addButton} onClick={addItem}>Add Item</button>
                            <button type="submit" className={purchaseStyle.submit} disabled={ hasPaymentError || hasSupplierError} onClick={()=>{
                                                            fetch(`http://localhost:3000/api/purchase`, {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify(purchaseData)
                                                            })
                                                            .then(res => {
                                                                if (!res.ok) throw new Error("Failed to add purchase");
                                                                return res.json();
                                                            })
                                                            .then(data => {
                                                                setShowAddModel(false);
                                                                setItems([{ productId: "", quantity: "", purchasePrice: "" }]);
                                                                setPayment({ purchasePaymentType: "cash", purchasePaymentAmount: "" });
                                                                setSupplierId("");
                                                                fetchSales();
                                                            })
                                                        }}>Save</button>
                            </div>
                        </div>
                    </div> 
                    )}   
                </div>
    
                <div className={styles.adjust}>
                    <input type="text" placeholder="Search..." className={styles.search} onChange={(e)=>setSearchTerm(e.target.value)}/>
                    <select   className={styles.filter}  onChange={(e) => setPaymentFilter(e.target.value)}>
                        <option value="">All Payment Types</option>
                        <option value="cash">Cash</option>
                        <option value="mobile_banking">Mobile Banking</option>
                        <option value="credit">Credit</option>
                    </select>
                </div>    
                <table className={styles.table}>
                    <thead className={styles.header}>
                        <tr>    
                            <th className={styles.names}>Date</th>
                            <th className={styles.names}>Time</th>
                            <th className={styles.names}>Total Amount</th>
                            <th className={styles.names}>Payment Type</th>
                            <th className={styles.names}>Supplier Name</th>
                        </tr>
                    </thead>
                    <tbody className={styles.body}>
                        {sortedPurchase.filter(item => {
                            const matchesSearch = item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesPayment = paymentFilter === "" || item.purchasePaymentType === paymentFilter;
                            return matchesSearch && matchesPayment;
                        })
                        .map(item => (
                            <tr key={item.purchaseId} onClick={() => {
                                    fetch(`http://localhost:3000/api/purchase/${item.purchaseId}`)
                                        .then(res => res.json())
                                        .then(data => {
                                            setSelectedPurchase(data);
                                        });
                                }}>
                                <td className={styles.att}>{item.purchaseDate}</td>
                                <td className={styles.att}>{item.purchaseTime}</td>
                                <td className={styles.att}>{item.purchaseTotalAmount}</td>
                                <td className={styles.att}>{item.purchasePaymentType}</td>
                                <td className={styles.att}>{item.supplierName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    selectedPurchase && (
                        <div className={styles.overlay}>
                            <div className={purchaseStyle.model}>
                                <button className ={ styles.closeBtn} type="button" onClick={() => setSelectedPurchase(null)}>
                                <FaTimes/>
                            </button>
                                {/* Sale summary */}
                                <label htmlFor="date"> Date</label>
                                <input value={selectedPurchase.purchase[0].purchaseDate} disabled/>
                                <label htmlFor="payment type">Payment Method</label>
                                <input value={selectedPurchase.payment[0].purchasePaymentType} disabled/>
                                <label htmlFor="total">Total Amount</label>
                                <input value={selectedPurchase.purchase[0].purchaseTotalAmount} disabled/>

                                {/* Customer */}
                                <label htmlFor="name">Customer Name</label>
                                <input value={supplier.find(c => c.supplierId === selectedPurchase.purchase[0].supplierId)?.supplierName} disabled/>

                                {/* Items */}
                                <label htmlFor="items">Sale Items</label>
                                {selectedPurchase.items.map((item, index) => {
                                    const productName = product.find(p => p.productId === parseInt(item.ProductId))?.productName;
                                    return(<div key={index}>
                                        <p>Product Name:{productName}| Qty: {item.quantity} | Price: {item.purchasePrice}</p>
                                    </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }
            </div>
        )
}

export default Purchase
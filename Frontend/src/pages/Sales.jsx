import { useState,useEffect } from "react"
import styles from "./product.module.css"
import saleStyle from "./sales.module.css"
import { FaTimes } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

function Sales(){
    const [sale,setSale] = useState([]);
    const [items, setItems] = useState([{ productId: "", quantity: "", salePrice: "" }]);
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");
    const [selectedSales, setSelectedSales] = useState(null)
    const [filteredBy,setFilteredBy] = useState("")
    const [showAddModel, setShowAddModel] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [product, setProduct] = useState([]);
    const [payment, setPayment] = useState({
        salePaymentType: "cash",
        salePaymentAmount: ""
    });
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const fetchSales=(() =>{
        fetch("http://localhost:3000/api/sales")
            .then(res => res.json())
            .then(data => {setSale(data);
                setLoading(false);});
    })
    useEffect(() => {
        fetchSales();
    fetch("http://localhost:3000/api/customer")
        .then(res => res.json())
        .then(data => setCustomers(data));

    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => setProduct(data));

    }, []);
    if (loading) {
    return <div>Loading...</div>;
    }
    
    //sort sales
    const salesWithNames = sale.map(s => ({
    ...s,
    customerName: customers.find(c => c.customerId === s.customerId)?.customerName || "Unknown"
    }));
    
    const sortedSales = [...salesWithNames].sort((a, b) => {
        if (filteredBy === "Date") {
            return a.saleDate.localeCompare(b.saleDate);
        } else if (filteredBy === "Total Amount") {
            return a.saleTotalAmount - b.saleTotalAmount;
        } else if (filteredBy === "customer name") {
            return a.customerName.localeCompare(b.customerName);
        }
        return (b.saleDate + b.saleTime).localeCompare(a.saleDate + a.saleTime);
    });

    //add empty item row
    const addItem = () => {setItems([...items, { productId: "", quantity: "", salePrice: "" }]);};

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
    // total amount of all the sales items
    const totalAmount = items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

    //the req.body fot the save
    const saleData = {
    customerId: parseInt(customerId)|| 9,
    items: items,
    payment: payment,
    credit: {
        saleCreditAmount: totalAmount-payment.salePaymentAmount,
        saleCreditDueDate: dueDateFormatted,
    }
    };
    //give total sales amount
    const totalSaleAmount = items.reduce((sum, item) => sum + (parseFloat(item.salePrice || 0) * parseFloat(item.quantity || 0)), 0);
    //error is when payment type is credit and customer is walk-in
    const hasCustomerError = payment.salePaymentType === "credit" && (!customerId || customerId === "9");
    const hasStockError = items.some(item => {
    const selectedProduct = product.find(p => p.productId === parseInt(item.productId));
    return selectedProduct && parseInt(item.quantity) > selectedProduct.productQuantity;
    });
    const hasPaymentError = parseFloat(payment.salePaymentAmount || 0) !== totalSaleAmount && payment.salePaymentType !== "credit";
    return(
            <div>
                <div className={styles.top}>
                    <h1 className={styles.title}>Sales</h1>
                    <button type="button" className={styles.addButton} onClick={()=>{setShowAddModel(true)}}>+  New Sales</button>
                    {showAddModel && (
                    <div className={styles.overlay}>
                        <div className={saleStyle.model}>
                            <button type="button" onClick={() => {
                                setShowAddModel(false);
                                setItems([{ productId: "", quantity: "", salePrice: "" }]);
                                    }} className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            {items.map((item, index) => (
                                <div key={index} className={saleStyle.itemRow}>
                                    <div className={saleStyle.deleteButton} >
                                    <p>Item {index+1}</p>
                                    {index > 0 && (
                                        <button className={saleStyle.deleteIcon} type="button" onClick={() => {
                                            const updatedItems = items.filter((_, i) => i !== index);
                                            setItems(updatedItems);
                                        }}><FaTrash /></button>
                                    )}
                                    </div>
                                    <div className={saleStyle.field}>
                                    <label htmlFor="productId">Product</label>
                                    <select name="product" id="SelectProduct"
                                    onChange={(e) => {
                                        const selected = product.find(p => p.productId === parseInt(e.target.value));
                                            updateItem(index, "productId", e.target.value);
                                            updateItem(index, "salePrice", selected.productSellingPrice);
                                        }} >
                                    <option>--Select--</option>
                                    {product.map(p => (
                                    <option key={p.productId} value={p.productId} 
                                    >{p.productName}</option>
                                    ))}
                                    </select>
                                    </div>
                                    <div className={saleStyle.field}>
                                    <label htmlFor="quantity">Quantity</label>
                                    <input 
                                    value={item.quantity} 
                                    onChange={(e) => updateItem(index, "quantity", e.target.value)} 
                                    className={saleStyle.lables}/>

                                    {(()=>{
                                        const selectedQuantity = product.find(p=> p.productId === parseInt(item.productId));
                                        if(selectedQuantity && (item.quantity) > (selectedQuantity.productQuantity)){
                                            return <p style={{ color: "#E53935", fontSize: "12px" }}>Warning: There Are only {selectedQuantity.quantity}, Please decrease the quantity!</p>;
                                        }
                                        return null;
                                    })()}
                                    
                                    </div>
                                  {/*this should be inserted when choosing product but it will allow editing but show warning if we decrease more than the actual purchasing price */}
                                    <div className={saleStyle.field}>
                                    <label htmlFor="salePrice">selling Price</label>
                                    <input 
                                    value={item.salePrice} 
                                    onChange={(e) => updateItem(index, "salePrice", e.target.value)} 
                                    />
                                    {(() => {
                                        const selectedProduct = product.find(p => p.productId === parseInt(item.productId));
                                        if (selectedProduct && parseFloat(item.salePrice) < parseFloat(selectedProduct.productPurchasingPrice)) {
                                            return <p style={{ color: "#E53935", fontSize: "12px" }}>Warning: Selling price is below purchasing price!</p>;
                                        }
                                        return null;
                                    })()}
                                    </div>
                                </div>
                                ))}
                                <label htmlFor="total">Total Amount</label>
                                <p>The Total amount is {totalSaleAmount}</p>
                                {/* if payment method is set to credit this can be allowed to be 0 and less than the selling price but if not the actual price must be payed. */}
                                <label htmlFor="amountPayed">Sale Payment Amount</label>
                                <input id="amountPayed" value={payment.salePaymentAmount}onChange={(e) => setPayment({...payment, salePaymentAmount: e.target.value})}/>
                                <label htmlFor="paymentMethod">Choose Payment Method</label>
                                <select id= "paymentMethod" value={payment.salePaymentType} onChange={(e)=>setPayment({...payment,salePaymentType: e.target.value})}>
                                    <option value="cash"defaultChecked>Cash</option>
                                    <option value="mobile_banking">Mobile Banking</option>
                                    <option value="credit">Credit</option>
                                </select>
                                    {hasPaymentError && (
                                        <p style={{ color: "#E53935", fontSize: "12px" }}>
                                            Warning: Payment amount doesn't match total. Set payment method to Credit.
                                        </p>
                                    )}
                                <label htmlFor="customer">
                                    Insert Customer
                                </label>
                                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                                    <option value="">Walk-in Customer</option>
                                    {customers.map(c => (
                                        <option key={c.customerId} value={c.customerId}>{c.customerName}</option>
                                    ))}
                                </select>
                                {hasCustomerError && (
                                        <p style={{ color: "#E53935", fontSize: "12px" }}>
                                            Warning:  Credit sales require a registered customer, not Walk-in.
                                        </p>
                                )}

                            <div className={saleStyle.bot}>
                            <button type="button" className={saleStyle.addButton} onClick={addItem}>Add Item</button>
                            <button type="submit" className={saleStyle.submit} disabled={hasStockError || hasPaymentError||hasCustomerError} onClick={()=>{
                                                            fetch(`http://localhost:3000/api/sales`, {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify(saleData)
                                                            })
                                                            .then(res => {
                                                                if (!res.ok) throw new Error("Failed to add sale");
                                                                return res.json();
                                                            })
                                                            .then(data => {
                                                                setShowAddModel(false);
                                                                setItems([{ productId: "", quantity: "", salePrice: "" }]);
                                                                setPayment({ salePaymentType: "cash", salePaymentAmount: "" });
                                                                setCustomerId("");
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
                            <th className={styles.names}>Customer Name</th>
                        </tr>
                    </thead>
                    <tbody className={styles.body}>
                        {sortedSales.filter(item => {
                            const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesPayment = paymentFilter === "" || item.salePaymentType === paymentFilter;
                            return matchesSearch && matchesPayment;
                        })
                        .map(item => (
                            <tr key={item.saleId} onClick={() => {
                                    fetch(`http://localhost:3000/api/sales/${item.saleId}`)
                                        .then(res => res.json())
                                        .then(data => {
                                            setSelectedSales(data);
                                        });
                                }}>
                                <td className={styles.att}>{item.saleDate}</td>
                                <td className={styles.att}>{item.saleTime}</td>
                                <td className={styles.att}>{item.saleTotalAmount}</td>
                                <td className={styles.att}>{item.salePaymentType}</td>
                                <td className={styles.att}>{item.customerName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    selectedSales && (
                        <div className={styles.overlay}>
                            <div className={saleStyle.model}>
                                <button className ={ styles.closeBtn} type="button" onClick={() => setSelectedSales(null)}>
                                <FaTimes/>
                            </button>
                                {/* Sale summary */}
                                <label htmlFor="date"> Date</label>
                                <input value={selectedSales.sales[0].saleDate} disabled/>
                                <label htmlFor="payment type">Payment Method</label>
                                <input value={selectedSales.payment[0].salePaymentType} disabled/>
                                <label htmlFor="total">Total Amount</label>
                                <input value={selectedSales.sales[0].saleTotalAmount} disabled/>

                                {/* Customer */}
                                <label htmlFor="name">Customer Name</label>
                                <input value={customers.find(c => c.customerId === selectedSales.sales[0].customerId)?.customerName || "Walk-in"} disabled/>

                                {/* Items */}
                                <label htmlFor="items">Sale Items</label>
                                {selectedSales.items.map((item, index) => {
                                    const productName = product.find(p => p.productId === parseInt(item.productId))?.productName || "Unknown";
                                    return(<div key={index}>
                                        <p>Product Name:{productName}| Qty: {item.quantity} | Price: {item.salePrice}</p>
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

export default Sales
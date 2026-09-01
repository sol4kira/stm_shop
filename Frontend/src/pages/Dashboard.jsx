import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css'
import { useState, useEffect } from 'react'
import { TbUserDollar } from "react-icons/tb";
import { API_URL } from "../../client";
function Dashboard(){
    const [lowStock,setLowStock] = useState([]);
    const [customerCredit,setCustomerCredit] = useState([]);
    const [supplierCredit, setSupplierCredit]=useState([]);
    const [totalSale,setTotalSale]= useState(0);
    const [totalPurchase,setTotalPurchase]= useState(0)
    const navigate= useNavigate();

    const fetchLowStack = () =>{
        fetch(`${API_URL}/api/products/low-stock`)
        .then(response=>response.json())
        .then(data=>setLowStock(data) )
    }
    const fetchCustomerCredit = () =>{
        fetch(`${API_URL}/api/sale-credit/sale-credit-deadline`)
        .then(response=>response.json())
        .then(data=>setCustomerCredit(data))
    }
    const fetchSupplierCredit= () =>{
        fetch(`${API_URL}/api/purchase-credit/purchase-credit-deadline`)
        .then(response=>response.json())
        .then(data=>setSupplierCredit(data))
    }
    const fetchTotalSale = () =>{
        fetch(`${API_URL}/api/sales/todays-sales-total`)
        .then(response=>response.json())
        .then(data=>setTotalSale(parseFloat(data.todaysSalesTotal)))
    }
    const  fetchTotalPurchase = () =>{
        fetch(`${API_URL}/api/purchase/todays-purchase-total`)
        .then(response=>response.json())
        .then(data=>setTotalPurchase(parseFloat(data.todaysPurchaseTotal)))
    }

    useEffect(()=>{
        fetchLowStack();
        fetchCustomerCredit();
        fetchSupplierCredit();
        fetchTotalSale();
        fetchTotalPurchase();
    },[])
    
    return(
        <div>
            <div className={styles.top}>
                <h1 className={styles.title}>DashBoard</h1>
                <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className={styles.dashboardGrid}>
                <div className={styles.tablesColumn}>
                    <table className={styles.lowStockTable} onClick={() => navigate('/products')}>
                        <thead>
                            <tr>
                                <th className={styles.names}>Product Name</th>
                                <th className={styles.names}>Product Type</th>
                                <th className={styles.names}>Quantity</th>
                                <th className={styles.names}>Product selling price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.map(items=>(
                            <tr key={items.productId}>
                                    <td className={styles.alt}>{items.productName}</td>
                                    <td className={styles.alt}>{items.productType}</td>
                                    <td className={styles.alt}>{items.productQuantity}</td>
                                    <td className={styles.alt}>{items.productSellingPrice}</td>
                                    </tr>
                                ))
                                }
                        </tbody>
                    </table>
                                    
                    <table className={styles.customerCredit} onClick={() => navigate('/credits/customer')}>
                        <thead>
                            <tr>
                                <th className={styles.names}>Customer Name</th>
                                <th className={styles.names}>Sale ID</th>
                                <th className={styles.names}>Price Left</th>
                                <th className={styles.names}>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerCredit.map(items => {
                                const isOverdue = new Date(items.saleCreditDueDate) < new Date();
                                return (
                                    <tr key={items.saleId} className={isOverdue ? styles.overdue : ""}>
                                        <td className={styles.alt}>{items.customerName}</td>
                                        <td className={styles.alt}>{items.saleId}</td>
                                        <td className={styles.alt}>{items.saleCreditAmount}</td>
                                        <td className={styles.alt}>{new Date(items.saleCreditDueDate).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                                        
                    <table className={styles.supplierCredit} onClick={() => navigate('/credits/supplier')}>
                        <thead>
                            <tr>
                                <th className={styles.names}>Supplier Name</th>
                                <th className={styles.names}>Purchase ID</th>
                                <th className={styles.names}>Price Left</th>
                                <th className={styles.names}>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplierCredit.map(items => {
                                const isOverdue = new Date(items.purchaseCreditDueDate) < new Date();
                                return (
                                    <tr key={items.supplierCreditId} className={isOverdue ? styles.overdue : ""}>
                                        <td className={styles.alt}>{items.supplierName}</td>
                                        <td className={styles.alt}>{items.purchaseId}</td>
                                        <td className={styles.alt}>{items.purchaseCreditAmount}</td>
                                        <td className={styles.alt}>{new Date(items.purchaseCreditDueDate).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                                        
                <div className={styles.cardsColumn}>
                    <div className={styles.totalCard} onClick={() => navigate('/sales')}>
                        <TbUserDollar size={32} />
                        <h3>Sales</h3>
                        <p className={styles.cardLabel}>Today's Sales Total</p>
                        <p className={styles.cardInput}>{totalSale.toFixed(2)}</p>
                    </div>
                                        
                    <div className={styles.totalCard} onClick={() => navigate('/Purchases')}>
                        <TbUserDollar size={32} />
                        <h3>Purchase</h3>
                        <p className={styles.cardLabel}>Today's Purchase Total</p>
                        <p className={styles.cardInput}>{totalPurchase.toFixed(2)}</p>
                    </div>
                </div>
            </div>                
        </div>
    )
}

export default Dashboard
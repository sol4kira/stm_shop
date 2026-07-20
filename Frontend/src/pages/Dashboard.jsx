import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css'
import { useState, useEffect } from 'react'
import { TbUserDollar } from "react-icons/tb";
function Dashboard(){
    const [lowStock,setLowStock] = useState([]);
    const [customerCredit,setCustomerCredit] = useState([]);
    const [supplierCredit, setSupplierCredit]=useState([]);
    const [totalSale,setTotalSale]= useState(0);
    const [totalPurchase,setTotalPurchase]= useState(0)
    const navigate= useNavigate();

    const fetchLowStack = () =>{
        fetch("http://localhost:3000/api/products/low-stock")
        .then(response=>response.json())
        .then(data=>setLowStock(data) )
    }
    const fetchCustomerCredit = () =>{
        fetch("http://localhost:3000/api/sale-credit/sale-credit-deadline")
        .then(response=>response.json())
        .then(data=>setCustomerCredit(data))
    }
    const fetchSupplierCredit= () =>{
        fetch("http://localhost:3000/api/purchase-credit/purchase-credit-deadline")
        .then(response=>response.json())
        .then(data=>setSupplierCredit(data))
    }
    const fetchTotalSale = () =>{
        fetch("http://localhost:3000/api/sales/todays-sales-total")
        .then(response=>response.json())
        .then(data=>setTotalSale(parseFloat(data.todaysSalesTotal)))
    }
    const  fetchTotalPurchase = () =>{
        fetch("http://localhost:3000/api/purchase/todays-purchase-total")
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
        // row 1 low stock and total sales
        <div className={styles.row}>
            <div className={styles.tables}>
            <table className={styles.lowStockTable} onClick={() => navigate('/Products')}>
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
            </div>
            <div className={styles.totalSaleCard} onClick={() => navigate('/sales')}>
                <TbUserDollar />
                <h3>Sales</h3>
                <p className={styles.cardLabel}>Today's Sales Total</p>
                <p className={styles.cardInput}>{totalSale.toFixed(2)}</p>
            </div>
        </div>
    )
}

export default Dashboard
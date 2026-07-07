import { useState,useEffect } from "react";
import styles from "./product.module.css"
import { FaTimes } from "react-icons/fa";

function SupplierCredit(){
    const [credit, setCredit] = useState([])
    const [supplier, setSupplier] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBy, setFilteredBy] = useState("date")
    const [payment,setPayment]= useState({
        purchaseCreditPaymentAmount:"",
    });
    const [selectedCredit, setSelectedCredit]= useState(null)
    const [creditHistory, setCreditHistory]= useState(null)
    const [creditPayments, setCreditPayments] = useState([]);

    const fetchSupplierCredit = () => {
                                    fetch("http://localhost:3000/api/purchase-credit")
                                    .then(response => response.json())
                                    .then(data => setCredit(data));
                                };

    useEffect(() => {
        fetchSupplierCredit();

        fetch("http://localhost:3000/api/supplier")
        .then(response=>response.json())
        .then(data=>setSupplier(data));
        }, []);

    const sortedCredit = [...credit].sort((a, b) => {
        if (filteredBy === "name") {
          return a.supplierName.localeCompare(b.supplierName);
        } else if (filteredBy === "creditDate") {
          return a.purchaseCreditPaymentDate - b.purchaseCreditPaymentDate;
        } else if (filteredBy === "payment-Amount") {
          return a.purchaseCreditPaymentAmount - b.purchaseCreditPaymentAmount;
        }
    return (b.purchaseDate).localeCompare(a.purchaseDate);
    });
    const paymentError = selectedCredit && parseFloat(payment.purchaseCreditPaymentAmount) > parseFloat(selectedCredit.purchaseCreditPaymentAmount);
    return(
        <div>
            <div className={styles.top}>
                <h1 className={styles.title}>Supplier Credits</h1>
            </div>

            <div className={styles.adjust}>
                <input type="text" placeholder="Search..." className={styles.search} onChange={(e)=>setSearchTerm(e.target.value)}/>
                <select className={styles.filter} onChange={(e)=>setFilteredBy(e.target.value)}>
                    <option value="">--Select--</option>
                    <option value="name">Name</option>
                    <option value="name">Date</option>
                </select>
            </div>    
            <table className={styles.table}>
                <thead className={styles.header}>
                    <tr>
                        <th className={styles.names}>Supplier Name</th>
                        <th className={styles.names}>Purchase Credit Amount</th>
                        <th className={styles.names}>Credit Date</th>
                        <th className={styles.names}>purchaseId</th>
                        <th className={styles.names}>Action</th>
                    </tr>
                </thead>
                <tbody className={styles.body}>
                    {sortedCredit.map(item => {
                        const supplierName = supplier.find(c => c.supplierId === item.supplierId)?.supplierName || "Unknown";
                        return (
                            <tr key={item.purchaseCreditId} onClick={() => {
                                setCreditHistory(item);
                                fetch(`http://localhost:3000/api/purchase-credit/${item.purchaseCreditId}/payment`)
                                    .then(res => res.json())
                                    .then(data => setCreditPayments(data));
                            }}>
                                <td className={styles.att}>{supplierName}</td>
                                <td className={styles.att} >{item.purchaseCreditAmount}</td>
                                <td className={styles.att}>{item.purchaseDate}</td>
                                <td className={styles.att}>{item.purchaseId}</td>
                                <td className={styles.att}>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCredit(item);
                                    fetch(`http://localhost:3000/api/purchase-credit/${item.purchaseCreditId}/payment`)
                                        .then(res => res.json())
                                        .then(data => setCreditPayments(data));
                                }} className={styles.submit} disabled={parseFloat(item.purchaseCreditAmount) === 0}>Pay</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {selectedCredit && (
                    <div className={styles.overlay}>
                        <div className={styles.model}>
                            <button type="close" onClick={() => {setSelectedCredit(null);setPayment({ purchaseCreditPaymentAmount: "" });}} className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            <p>Total Amount to be payed:{selectedCredit.purchaseCreditAmount}</p>
                            <p>Last Paid Amount: {creditPayments.length > 0 ? creditPayments[creditPayments.length - 1].purchaseCreditPaymentAmount : "No payments yet"}</p>
                            <p>Payment left: {selectedCredit.purchaseCreditAmount}</p>
                            <label htmlFor="pay">Amount to pay: </label>
                            <input type="number" value={payment.purchaseCreditPaymentAmount} onChange={(e) => setPayment({...payment,purchaseCreditPaymentAmount: e.target.value})}/>
                            <button disabled={paymentError} type="submit" className={styles.submit} onClick={() => {
                                fetch(`http://localhost:3000/api/purchase-credit/${selectedCredit.purchaseCreditId}/payment`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(payment)
                                })
                                .then(res => res.json())
                                .then(data => {
                                    setSelectedCredit(null);
                                    setPayment({ purchaseCreditPaymentAmount: "" });
                                    fetchSupplierCredit();
                                });
                            }}>Pay</button>
                            {(()=>{
                                        const selectedCreditDisabled = credit.find(p=> p.purchaseCreditId === parseInt(selectedCredit.purchaseCreditId));
                                        if(selectedCreditDisabled && parseFloat(payment.purchaseCreditPaymentAmount) > parseFloat(selectedCredit.purchaseCreditAmount)){
                                            return <p style={{ color: "#E53935", fontSize: "12px" }}>Warning:The amount payed is greater than the amount left in the credit.</p>;
                                        }
                                        return null;
                            })()}
                        </div>
                    </div>
                )}
                {creditHistory && (
                        <div className={styles.overlay}>
                            <div className={styles.model}>
                                <button onClick={() => setCreditHistory(null)} className={styles.closeBtn}><FaTimes/></button>
                                <h3>Payment History</h3>
                                {creditPayments.length > 0 ? creditPayments.map((p, index) => (
                                    <div key={index}>
                                        <p>Date: {p.paymentDate} | Amount: {p.purchaseCreditPaymentAmount}</p>
                                    </div>
                                )) : <p>No payments made yet</p>}
                            </div>
                        </div>
                    )}
        </div>
    )
}
export default SupplierCredit;
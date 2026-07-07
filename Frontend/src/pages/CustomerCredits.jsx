import { useState,useEffect } from "react";
import styles from "./product.module.css"
import { FaTimes } from "react-icons/fa";

function CustomerCredit(){
    const [credit, setCredit] = useState([])
    const [customer, setCustomer] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBy, setFilteredBy] = useState("date")
    const [payment,setPayment]= useState({
        saleCreditPaymentAmount:"",
    });
    const [selectedCredit, setSelectedCredit]= useState(null)
    const [creditHistory, setCreditHistory]= useState(null)
    const [creditPayments, setCreditPayments] = useState([]);

    const fetchCustomerCredit = () => {
                                    fetch("http://localhost:3000/api/sale-credit")
                                    .then(response => response.json())
                                    .then(data => setCredit(data));
                                };

    useEffect(() => {
        fetchCustomerCredit();

        fetch("http://localhost:3000/api/customer")
        .then(response=>response.json())
        .then(data=>setCustomer(data));

        }, []);

    const sortedCredit = [...credit].sort((a, b) => {
        if (filteredBy === "name") {
          return a.customerName.localeCompare(b.customerName);
        } else if (filteredBy === "creditDate") {
          return a.saleCreditPaymentDate - b.saleCreditPaymentDate;
        } else if (filteredBy === "payment-Amount") {
          return a.saleCreditPaymentAmount - b.saleCreditPaymentAmount;
        }
    return (b.saleDate).localeCompare(a.saleDate);
    });
    const paymentError = selectedCredit && parseFloat(payment.saleCreditPaymentAmount) > parseFloat(selectedCredit.saleCreditAmount);
    return(
        <div>
            <div className={styles.top}>
                <h1 className={styles.title}>Customer Credits</h1>
            </div>

            <div className={styles.adjust}>
                <input type="text" placeholder="Search..." className={styles.search} onChange={(e)=>setSearchTerm(e.target.value)}/>
                <select className={styles.filter} onChange={(e)=>setFilteredBy(e.target.value)}>
                    <option value="">--Select--</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                </select>
            </div>    
            <table className={styles.table}>
                <thead className={styles.header}>
                    <tr>
                        <th className={styles.names}>Customer Name</th>
                        <th className={styles.names}>Sale Credit Amount</th>
                        <th className={styles.names}>Credit Date</th>
                        <th className={styles.names}>saleId</th>
                        <th className={styles.names}>Action</th>
                    </tr>
                </thead>
                <tbody className={styles.body}>
                    {sortedCredit.map(item => {
                        const customerName = customer.find(c => c.customerId === item.customerId)?.customerName || "Unknown";
                        return (
                            <tr key={item.saleCreditId} onClick={() => {
                                setCreditHistory(item);
                                fetch(`http://localhost:3000/api/sale-credit/${item.saleCreditId}/payments`)
                                    .then(res => res.json())
                                    .then(data => setCreditPayments(data));
                            }}>
                                <td className={styles.att}>{customerName}</td>
                                <td className={styles.att} >{item.saleCreditAmount}</td>
                                <td className={styles.att}>{item.saleDate}</td>
                                <td className={styles.att}>{item.saleId}</td>
                                <td className={styles.att}>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCredit(item);
                                    fetch(`http://localhost:3000/api/sale-credit/${item.saleCreditId}/payments`)
                                        .then(res => res.json())
                                        .then(data => setCreditPayments(data));
                                }} className={styles.submit} disabled={parseFloat(item.saleCreditAmount) === 0}>Pay</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {selectedCredit && (
                    <div className={styles.overlay}>
                        <div className={styles.model}>
                            <button type="close" onClick={() => {setSelectedCredit(null);setPayment({ saleCreditPaymentAmount: "" });}} className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            <p>Total Amount to be payed:{selectedCredit.saleCreditAmount}</p>
                            <p>Last Paid Amount: {creditPayments.length > 0 ? creditPayments[creditPayments.length - 1].saleCreditPaymentAmount : "No payments yet"}</p>
                            <p>Payment left: {selectedCredit.saleCreditAmount}</p>
                            <label htmlFor="pay">Amount to pay: </label>
                            <input type="number" value={payment.saleCreditPaymentAmount} onChange={(e) => setPayment({...payment,saleCreditPaymentAmount: e.target.value})}/>
                            <button disabled={paymentError} type="submit" className={styles.submit}onClick={() => {
                                fetch(`http://localhost:3000/api/sale-credit/${selectedCredit.saleCreditId}/payment`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(payment)
                                })
                                .then(res => res.json())
                                .then(data => {
                                    setSelectedCredit(null);
                                    setPayment({ saleCreditPaymentAmount: "" });
                                    fetchCustomerCredit();
                                });
                            }}>Pay</button>
                            {(()=>{
                                        const selectedCreditDisabled = credit.find(p=> p.saleCreditId === parseInt(selectedCredit.saleCreditId));
                                        if(selectedCreditDisabled && parseFloat(payment.saleCreditPaymentAmount) > parseFloat(selectedCredit.saleCreditAmount)){
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
                                        <p>Date: {p.paymentDate} | Amount: {p.saleCreditPaymentAmount}</p>
                                    </div>
                                )) : <p>No payments made yet</p>}
                            </div>
                        </div>
                    )}
        </div>
    )
}
export default CustomerCredit;
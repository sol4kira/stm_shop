import { useState,useEffect } from "react"
import styles from "./product.module.css"
import { FaTimes } from "react-icons/fa";
import { API_URL } from "../../client";

function Customers(){
   const [customer, setCustomer] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredBy, setFilteredBy] = useState("date")
   const [selectedCustomer, setSelectedCustomer] = useState(null)
   const [editData, setEditData] = useState(null)
   const [deleteError, setDeleteError] = useState("")
   const [showAddModel, setShowAddModel] = useState(false)
   const [newCustomer,setNewCustomer] = useState({
    customerId:"",
    customerName:"",
    customerPhoneNumber:""
   })

    const fetchCustomer = () => {
                                    fetch(`${API_URL}/api/customer`)
                                    .then(response => response.json())
                                    .then(data => setCustomer(data));
                                };

    useEffect(() => {
        fetchCustomer();
        }, []);

    const sortedCustomer = [...customer].sort((a, b) => {
        if (filteredBy === "name") {
          return a.customerName.localeCompare(b.customerName);
        } else if (filteredBy === "phone-number") {
          return a.customerPhoneNumber - b.customerPhoneNumber;
        }
    return 0;
    });
   
    return(
        <div>
            <div className={styles.top}>
                <h1 className={styles.title}>Customer</h1>
                <button type="button" className={styles.addButton} onClick={()=>{setShowAddModel(true)}}>+  ADD Customer</button>
                    {showAddModel && (
                    <div className={styles.overlay}>
                        <div className={styles.model}>
                            <button type="button" onClick={() => {
                                setShowAddModel(false);
                                setNewCustomer({
                                    customerId:"",
                                    customerName: "",
                                    customerPhoneNumber: ""
                                });
                            }} className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            <label htmlFor="Name">Customer ID</label>
                            <input value={newCustomer.customerId} onChange={(e) => setNewCustomer({...newCustomer, customerId: e.target.value})} />

                            <label htmlFor="Name">Customer Name</label>
                            <input value={newCustomer.customerName} onChange={(e) => setNewCustomer({...newCustomer, customerName: e.target.value})} />

                            <label htmlFor="phone_number">Phone Number</label>
                            <input value={newCustomer.customerPhoneNumber} onChange={(e) => setNewCustomer({...newCustomer, customerPhoneNumber: e.target.value})}/>

                            
                            <button type="submit" className={styles.submit} onClick={()=>{
                                fetch(`${API_URL}/api/customer`,{
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newCustomer)
                                })
                                .then(res => {
                                    if (!res.ok) {
                                        throw new Error("Failed to add customer");
                                    }
                                    return res.json();
                                })
                                .then(data => {
                                setShowAddModel(false)
                                setNewCustomer({
                                    customerId:"",
                                    customerName: "",
                                    customerPhoneNumber: ""
                                });
                                fetchCustomer();
                                })
                            }}>Save</button>
                        </div>
                    </div> 
                    )}   
            </div>

            <div className={styles.adjust}>
                <input type="text" placeholder="Search..." className={styles.search} onChange={(e)=>setSearchTerm(e.target.value)}/>
                <select className={styles.filter} onChange={(e)=>setFilteredBy(e.target.value)}>
                    <option value="">--Select--</option>
                    <option value="phone_number">Phone Number</option>
                    <option value="name">Name</option>
                </select>
            </div>    
            <table className={styles.table}>
                <thead className={styles.header}>
                    <tr>
                        <th className={styles.names}>Name</th>
                        <th className={styles.names}>Phone Number</th>
                    </tr>
                </thead>
                <tbody className={styles.body}>
                    {sortedCustomer.filter(item => item.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item=>(
                    <tr key={item.customerId} onClick={() => { setSelectedCustomer(item);setEditData(item);}}>
                    <td className={styles.att}>{item.customerName}</td>
                    <td className={styles.att}>{item.customerPhoneNumber}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            {
                selectedCustomer && (
                    <div className={styles.overlay}>
                        <div className={styles.model}>
                            <button type="close" onClick={() => setSelectedCustomer(null)}  className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            <label htmlFor="Name">Customer ID</label>
                            <input value={editData.customerId} disabled />

                            <label htmlFor="Name">Customer Name</label>
                            <input value={editData.customerName} onChange={(e) => setEditData({...editData, customerName: e.target.value})} />

                            <label htmlFor="phone_number">Phone Number</label>
                            <input value={editData.customerPhoneNumber} onChange={(e) => setEditData({...editData, customerPhoneNumber: e.target.value})} />

                            {deleteError && <p style={{ color: "#E53935", fontSize: "14px" }}>{deleteError}</p>}

                            <div className={styles.modelButton}>
                                <button type="submit"className={styles.submit} 
                                        onClick={() => {
                                        fetch(`${API_URL}/api/customer/${editData.customerId}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(editData)
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            setSelectedCustomer(null)
                                            fetchCustomer();
                                        })
                                        }}>
                                        Edit</button>
                                <button type="submit" className={styles.delete}
                                onClick={()=>{
                                    setDeleteError("This customer cannot be deleted because they have associated sales records.")
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

export default Customers
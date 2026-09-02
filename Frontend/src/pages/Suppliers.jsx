import { useState,useEffect } from "react"
import styles from "./product.module.css"
import { FaTimes } from "react-icons/fa";
import { API_URL } from "../../client";

function Suppliers(){
   const [supplier, setSupplier] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredBy, setFilteredBy] = useState("date")
   const [selectedSupplier, setSelectedSupplier] = useState(null)
   const [editData, setEditData] = useState(null)
   const [deleteError, setDeleteError] = useState("")
   const [showAddModel, setShowAddModel] = useState(false)
   const [newSupplier,setNewSupplier] = useState({
    supplierName:"",
    supplierPhoneNumber:""
   })

    const fetchSupplier = () => {
                                    fetch(`${API_URL}/api/supplier`)
                                    .then(response => response.json())
                                    .then(data => setSupplier(data));
                                };

    useEffect(() => {
        fetchSupplier();
        }, []);

    const sortSupplier = [...supplier].sort((a, b) => {
        if (filteredBy === "name") {
          return a.supplierName.localeCompare(b.supplierName);
        } else if (filteredBy === "phone-number") {
          return a.supplierPhoneNumber - b.supplierPhoneNumber;
        }
    return 0;
    });
   
    return(
        <div>
            <div className={styles.top}>
                <h1 className={styles.title}>Supplier</h1>
                <button type="button" className={styles.addButton} onClick={()=>{setShowAddModel(true)}}>+  ADD supplier</button>
                    {showAddModel && (
                    <div className={styles.overlay}>
                        <div className={styles.model}>
                            <button type="button" onClick={() => {
                                setShowAddModel(false);
                                setNewSupplier({
                                    supplierName: "",
                                    supplierPhoneNumber: ""
                                });
                            }} className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            <label htmlFor="Name">Supplier Name</label>
                            <input value={newSupplier.supplierName} onChange={(e) => setNewSupplier({...newSupplier, supplierName: e.target.value})} />

                            <label htmlFor="phone_number">Phone Number</label>
                            <input value={newSupplier.supplierPhoneNumber} onChange={(e) => setNewSupplier({...newSupplier, supplierPhoneNumber: e.target.value})}/>

                            
                            <button type="submit" className={styles.submit} onClick={()=>{
                                fetch(`${API_URL}/api/supplier`,{
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newSupplier)
                                })
                                .then(res => res.json())
                                .then(data => {
                                setShowAddModel(false)
                                setNewSupplier({
                                    supplierName: "",
                                    supplierPhoneNumber: ""
                                });
                                fetchSupplier();
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
                    {sortSupplier.filter(item => item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item=>(
                    <tr key={item.productId} onClick={() => { setSelectedSupplier(item);setEditData(item);}}>
                    <td className={styles.att}>{item.supplierName}</td>
                    <td className={styles.att}>{item.supplierPhoneNumber}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            {
                selectedSupplier && (
                    <div className={styles.overlay}>
                        <div className={styles.model}>
                            <button type="close" onClick={() => setSelectedSupplier(null)}  className={styles.closeBtn}>
                                <FaTimes/>
                            </button>
                            <label htmlFor="Name">supplier Name</label>
                            <input value={editData.supplierName} onChange={(e) => setEditData({...editData, supplierName: e.target.value})} />

                            <label htmlFor="phone_number">Phone Number</label>
                            <input value={editData.supplierPhoneNumber} onChange={(e) => setEditData({...editData, supplierPhoneNumber: e.target.value})} />

                            {deleteError && <p style={{ color: "#E53935", fontSize: "14px" }}>{deleteError}</p>}

                            <div className={styles.modelButton}>
                                <button type="submit"className={styles.submit} 
                                        onClick={() => {
                                        fetch(`${API_URL}/api/supplier/${editData.supplierId}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(editData)
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            setSelectedSupplier(null)
                                            fetchSupplier();
                                        })
                                        }}>
                                        Edit</button>
                                <button type="submit" className={styles.delete}
                                onClick={()=>{
                                    setDeleteError("This supplier cannot be deleted because it is associated with products and a purchase record.")
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

export default Suppliers
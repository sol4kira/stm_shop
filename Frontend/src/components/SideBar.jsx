import { useState } from "react";
import {NavLink} from "react-router-dom"
import styles from "./sideBar.module.css"

function SideBar(){
    const [openCredit,setOpenCredit] = useState(false)
return(
<div className={styles.container}>
    <h1 className={styles.title}>STM Shop</h1>
    <NavLink to ="/DashBoard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Dashboard</NavLink>
    <NavLink to ="/Products" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Products</NavLink>
    <NavLink to ="/Purchases"className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Purchase</NavLink>
    <NavLink to ="/sales"className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Sales</NavLink><div>
    <button onClick={() => setOpenCredit(!openCredit)} className={styles.dropDown} >
        Credits
    </button>
    {openCredit && (
        <div style={{paddingLeft: "15px"}}>
            <NavLink to="/credits/customer"className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Customer Credits</NavLink>
            <NavLink to="/credits/supplier" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Supplier Credits</NavLink>
        </div>
    )}
</div>
    <NavLink to ="/Suppliers" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Suppliers</NavLink>
    <NavLink to ="/Customers"className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Customers</NavLink>
    <NavLink to ="/Report"className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} >Report</NavLink>
</div>
);
}

export default SideBar;
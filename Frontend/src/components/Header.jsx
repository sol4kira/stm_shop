import styles from "./header.module.css"

function Header(){
    return(
    <div className={styles.header}>
        <p className={styles.p}>🔔</p>
    </div>
    );
}

export default Header
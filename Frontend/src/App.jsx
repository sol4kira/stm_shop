import SideBar from "./components/SideBar";
import Dashboard from "./pages/DashBoard";
import Purchases from "./pages/Purchases";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Report from "./pages/Report";
import CustomerCredits from "./pages/CustomerCredits";
import SupplierCredits from "./pages/SupplierCredits";
import Credits from "./pages/Credits";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <SideBar />
      <div style={{ marginLeft: "256px", padding: "20px" }}>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Purchases" element={<Purchases />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Sales" element={<Sales />} />
          <Route path="/Suppliers" element={<Suppliers />} />
          <Route path="/Credits" element={<Credits />} />
          <Route path="/credits/customer" element={<CustomerCredits />} />
          <Route path="/credits/supplier" element={<SupplierCredits />} />
          <Route path="/Customers" element={<Customers />} />
          <Route path="/Report" element={<Report />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

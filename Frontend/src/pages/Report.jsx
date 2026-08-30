import { useState,useEffect } from "react"
import report from "./report.module.css";
import {
  ShoppingBag,
  UserRoundPlus,
  CreditCard,
  UserRoundArrowLeft
} from "lucide-react";
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const getDateRange = (filterType) =>{
        const today = new Date()
        const todayStr = today.toISOString().split("T")[0];

        let from, to
         
        switch (filterType){
            case "today":
                from = todayStr;
                to=todayStr;
                break;
            case "thisWeek":{
                const dayOfWeek = today.getDay();
                const monday = new Date(today);
                monday.setDate(today.getDate() - (dayOfWeek ===0 ? 6 : dayOfWeek-1));
                from = monday.toISOString().split("T")[0];
                to = todayStr;
                break;}
            case "thisMonth":{
                const firstOfMonth = new Date(today.getFullYear(),today.getMonth(),1)
                from = firstOfMonth.toISOString().split("T")[0];
                to = todayStr;
                break;}
            case "thisYear":{
                const firstOfYear = new Date(today.getFullYear(),0,1);
                from = firstOfYear.toISOString().split("T")[0]
                to = todayStr;
                break;}

                default:
                    from = todayStr
                    to = todayStr
        }
        return{ from,to};
    }

function Report(){
    const [purchaseSummary,setPurchaseSummary] = useState({
        from:"",
        to:""
    });
    const [salesSummary,setSalesSummary] = useState({
        from:"",
        to:""
    });
    const [fromDate,setFromDate]= useState(null);
    const [toDate,setToDate]= useState(null);
    //compare date
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [showCustomInput,setShowCustomInput]=useState(false);
    const [customerCredit,setCustomerCredit] = useState({});
    const [day1Result, setDay1Result] = useState({});
    const [day2Result, setDay2Result] = useState({});
    const [activeFilter, setActiveFilter] = useState("today");


    const fetchPurchaseSummary = (from,to) =>{
        fetch(`http://localhost:3000/api/purchase/report-summary?from=${from}&to=${to}`)
            .then(response => response.json())
            .then(data => setPurchaseSummary(data));
    }
    const fetchSalesSummary = (from,to) =>{
        fetch(`http://localhost:3000/api/sales/report-summary?from=${from}&to=${to}`)
            .then(response => response.json())
            .then(data => setSalesSummary(data));
    }
    const fetchCustomerCreditSummery = ()=>{
        fetch("http://localhost:3000/api/sale-credit/report-summary-total")
        .then(response=>response.json())
        .then(data=>setCustomerCredit(data))
    }
    const fetchDay1Sales = (date) => {
    fetch(`http://localhost:3000/api/sales/report-summary?from=${date}&to=${date}`)
        .then(response => response.json())
        .then(data => setDay1Result(data));
    }
    const fetchDay2Sales = (date) => {
        fetch(`http://localhost:3000/api/sales/report-summary?from=${date}&to=${date}`)
            .then(response => response.json())
            .then(data => setDay2Result(data));
    }
    useEffect(()=>{
        const {from,to} = getDateRange("today");
        fetchPurchaseSummary(from,to);
        fetchSalesSummary(from,to);
        fetchCustomerCreditSummery();
    },[])
    const totalSale = Number(salesSummary.totalAmount||0)
    const totalPurchase = Number(purchaseSummary.totalAmount||0)
    const netProfit= (totalSale - totalPurchase).toFixed(2)

    return(
        <div className={report.container}>
            <div><h1>Report</h1></div>
            <div className ={report.filterRow}>
                <button type="button" onClick={()=>{
                    setActiveFilter("today");
                    const {from,to} = getDateRange("today")
                    fetchPurchaseSummary(from, to);
                    fetchSalesSummary(from, to);
                }} className={`${report.filterButton} ${activeFilter === "today" ? report.filterButtonActive : ""}`}>Today</button>
                <button type="button"onClick={()=>{
                    setActiveFilter("thisWeek");
                    const {from,to} = getDateRange("thisWeek")
                    fetchPurchaseSummary(from, to);
                    fetchSalesSummary(from, to);
                }}className={`${report.filterButton} ${activeFilter === "thisWeek" ? report.filterButtonActive : ""}`}>This Week</button>
                <button type="button" onClick={()=>{
                    setActiveFilter("thisMonth");
                    const {from,to} = getDateRange("thisMonth")
                    fetchPurchaseSummary(from, to);
                    fetchSalesSummary(from, to);
                }}className={`${report.filterButton} ${activeFilter === "thisMonth" ? report.filterButtonActive : ""}`}>This Month</button>
                <button type="button"onClick={()=>{
                    setActiveFilter("thisYear");
                    const {from,to} = getDateRange("thisYear")
                    fetchPurchaseSummary(from, to);
                    fetchSalesSummary(from, to);
                }} className={`${report.filterButton} ${activeFilter === "thisYear" ? report.filterButtonActive : ""}`}>This Year</button>

                <div>
                    <button
                        onClick={() => {
                            setActiveFilter("custom");
                            setShowCustomInput(prev => !prev);
                        }}className={`${report.filterButton} ${activeFilter === "custom" ? report.filterButtonActive : ""}`}
                    >
                        Custom Date
                    </button>
                    {showCustomInput && (
                        <div className={report.expandSection}>
                            <DatePickerInput
                                value={fromDate}
                                onChange={setFromDate}
                                placeholder="From date"
                                className={report.dateInput}
                            />
                            <DatePickerInput
                                value={toDate}
                                onChange={setToDate}
                                placeholder="To date"
                                className={report.dateInput}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (!fromDate || !toDate) return;
                                    const formattedFromDate = dayjs(fromDate).format("YYYY-MM-DD");
                                    const formattedToDate = dayjs(toDate).format("YYYY-MM-DD");
                                    fetchPurchaseSummary(formattedFromDate, formattedToDate);
                                    fetchSalesSummary(formattedFromDate, formattedToDate);
                                }}className={`${report.filterButton} ${report.applyButton}`}
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
 
            </div>
            <div className={report.cardsRow}>
                <div className={report.reportCard}>
                    <ShoppingBag className={report.icon}/>
                    <h3>Total Sale</h3 >
                    <p className={report.cardValue}>{Number(salesSummary.totalAmount||0).toFixed(2)}</p>
                    <p className={report.cardCount}>{Number(salesSummary.totalCount||0)}</p>
                </div>
                <div className={report.reportCard}>
                    <UserRoundPlus className={report.icon}/>
                    <h3>Total Purchase</h3>
                    <p className={report.cardValue}>{Number(purchaseSummary.totalAmount||0).toFixed(2)}</p>
                    <p className={report.cardCount}>{Number(purchaseSummary.totalCount||0)}</p>
                </div>
                <div className={report.reportCard}>
                    <UserRoundArrowLeft className={report.icon}/>
                    <h3>Net Profit</h3>
                    <p className={report.cardValue}>{netProfit}</p>
                </div>
                <div className={report.reportCard}>
                    <CreditCard className={report.icon}/>
                    <h3>Customer Credit</h3>
                    <p className={report.cardValue}>{Number(customerCredit.totalOwed||0).toFixed(2)}</p>
                    <p className={report.cardCount}>{Number(customerCredit.totalCount||0)}</p>
                </div>
            </div>
            <div className={report.compareSection}>
                <h3>Compare Sales</h3>
                <div className={report.compareInputsRow}>
                    <div className={report.compareInputGroup}>
                            <label>From Date</label>
                            <DatePickerInput
                                value={date1}
                                onChange={setDate1}
                                placeholder="Select date"
                            />
                        </div>

                        <div className={report.compareInputGroup}>
                            <label>To Date</label>
                            <DatePickerInput
                                value={date2}
                                onChange={setDate2}
                                placeholder="Select date"
                            />
                        </div>
                    <button
                        type="submit"
                        onClick={() => { fetchDay1Sales(date1); fetchDay2Sales(date2); }}
                        className={report.applyButton}
                    >Apply</button>
                </div>

                <div className={report.compareResultsRow}>
                    <div className={report.compareResultCard}>
                        <h4>Day 1</h4>
                        <p className={report.compareLabel}>sale total</p>
                        <p className={report.compareValue}>{Number(day1Result.totalAmount || 0).toFixed(2)}</p>
                    </div>
                    <div className={report.compareResultCard}>
                        <h4>Day 2</h4>
                        <p className={report.compareLabel}>sale total</p>
                        <p className={report.compareValue}>{Number(day2Result.totalAmount || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Report
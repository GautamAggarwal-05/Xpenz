import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Cards from '../components/Cards/Cards'
// import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/addExpenseModal';
import AddIncomeModal from '../components/Modals/addIncomeModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from "firebase/firestore";
import { auth,db} from "../firebase";
import dayjs from 'dayjs';
import {query, getDocs } from "firebase/firestore";
import Transactiontable from '../components/TransactionsTable/Transactiontable';
import Notransactions from '../components/NoTransactions/NoTransactions';
import ChartsComponent from '../components/chartsComponent.js';
import { Audio } from 'react-loader-spinner'

function DashBoard() {
  const[loading,setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [user] = useAuthState(auth);
  //usestate to get all transaction data from firebase database
  const [transactions, setTransactions] = useState([]);

  const[income,setIncome] = useState(0);
  const[expense,setExpense] = useState(0);
  const[balance,setBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values,type)=>{
    const newTransaction = {
      type:type,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    }
    addTransaction(newTransaction);
  }
  async function addTransaction(newTransaction,many){
    //Create a Doc of transaction
    try{
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`),
      newTransaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction added successfully");
      let newArr = transactions;
      newArr.push(newTransaction);
      setTransactions(newArr);
      calculateBalance();
      // fetchTransaction();
    }catch(err){
      console.log(err);
      if(!many) toast.error("Failed To add transaction")
    }
  }

  useEffect(() => {
    //Get all docs 
    fetchTransaction();
  },[user]);


  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = ()=>{
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction)=>{
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      }else{
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setBalance(incomeTotal - expenseTotal);

  }

  async function fetchTransaction(){
    setLoading(true);
    if(user){
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      toast.success("Transactions fetched")
    }
    setLoading(false);
  }

  function reset(){
    setIncome(0);
    setExpense(0);
    setBalance(0);
  }

  const sortedTransactions = transactions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
  })  
              

  return (
    <div>
      <Header/>
      {loading?(<Audio
  height="80"
  width="80"
  radius="9"
  color="green"
  ariaLabel="three-dots-loading"
  wrapperStyle
  wrapperClass
/>)
      :
      (<>
      <Cards showExpenseModal= {showExpenseModal} showIncomeModal={showIncomeModal} income={income}
      expense={expense} balance={balance} reset={reset}/>

      {/* <Modal
        open={isIncomeModalVisible}
       title="Add Income"
       style={{fontWeight:600}}
      onCancel={handleIncomeCancel}
      footer={null}>
        Income</Modal>
      <Modal open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      title="Expense"
        style={{fontWeight:600}}
        footer={null}>
        Expense</Modal> */}

          {transactions &&transactions !== 0?<ChartsComponent sortedTransactions={sortedTransactions}/>:<Notransactions/>}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />  

          <Transactiontable transactions={transactions} addTransaction = {addTransaction} fetchTransaction ={fetchTransaction}/>
      </>)}

    </div>
  )
}

export default DashBoard

import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Cards from '../components/Cards/Cards';
import AddExpenseModal from '../components/Modals/addExpenseModal';
import AddIncomeModal from '../components/Modals/addIncomeModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import dayjs from 'dayjs';
import { query, getDocs } from "firebase/firestore";
import Transactiontable from '../components/TransactionsTable/Transactiontable';
import Notransactions from '../components/NoTransactions/NoTransactions';
import ChartsComponent from '../components/chartsComponent.js';
import { Audio } from 'react-loader-spinner';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

function DashBoard() {
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
    setCurrentTransaction(null);
    setIsUpdate(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
    setCurrentTransaction(null);
    setIsUpdate(false);
  };

  const onFinish = async (values, type) => {
    const newTransaction = {
      type: type,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    if (isUpdate && currentTransaction) {
      await updateTransaction(newTransaction);
    } else {
      await addTransaction(newTransaction);
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      if (!user || !user.uid) {
        throw new Error("User is not authenticated");
      }

      if (!currentTransaction || !currentTransaction.id) {
        throw new Error("No current transaction to update");
      }

      const transactionDocRef = doc(db, `users/${user.uid}/transactions`, currentTransaction.id);

      await updateDoc(transactionDocRef, {
        type: updatedTransaction.type,
        date: updatedTransaction.date,
        amount: updatedTransaction.amount,
        tag: updatedTransaction.tag,
        name: updatedTransaction.name,
      });

      const newTransactions = transactions.map((transaction) =>
        transaction.id === currentTransaction.id ? { ...updatedTransaction, id: transaction.id } : transaction
      );

      setTransactions(newTransactions);
      setIsUpdate(false);
      setCurrentTransaction(null);

      if (updatedTransaction.type === "income") {
        setIsIncomeModalVisible(false);
      } else {
        setIsExpenseModalVisible(false);
      }

      toast.success("Transaction updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update transaction");
    }
  };

  async function addTransaction(newTransaction, many) {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), newTransaction);
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction added successfully");
      let newArr = [...transactions, { ...newTransaction, id: docRef.id }];
      setTransactions(newArr);
      calculateBalance();
    } catch (err) {
      console.log(err);
      if (!many) toast.error("Failed To add transaction");
    }
  }

  useEffect(() => {
    fetchTransaction();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransaction() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push({ ...doc.data(), id: doc.id });
      });
      setTransactions(transactionArray);
      toast.success("Transactions fetched");
    }
    setLoading(false);
  }

  async function reset() {
    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);

        const deletePromises = querySnapshot.docs.map(docSnapshot => {
          const docRef = doc(db, `users/${user.uid}/transactions`, docSnapshot.id);
          return deleteDoc(docRef);
        });
        await Promise.all(deletePromises);

        setTransactions([]);
        setIncome(0);
        setExpense(0);
        setBalance(0);

        toast.success("All transactions deleted and balance reset");
      } catch (err) {
        console.log(err);
        toast.error("Failed to reset transactions");
      }
    }
  }

  const sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const showUpdateModal = (transaction) => {
    setCurrentTransaction(transaction);
    setIsUpdate(true);
    if (transaction.type === "income") {
      setIsIncomeModalVisible(true);
    } else {
      setIsExpenseModalVisible(true);
    }
  };

  return (
    <div>
      <Header />
      {loading ? (
        <div className='Loader'>
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          wrapperStyle
          wrapperClass 
        /></div>
      ) : (
        <>
          <Cards showExpenseModal={showExpenseModal} showIncomeModal={showIncomeModal} income={income}
            expense={expense} balance={balance} reset={reset} />

          {transactions && transactions.length > 0 ? <ChartsComponent sortedTransactions={sortedTransactions} /> : <Notransactions />}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={(values) => onFinish(values, 'expense')}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={(values) => onFinish(values, 'income')}
          />

          <Transactiontable transactions={transactions} addTransaction={addTransaction} fetchTransaction={fetchTransaction} showUpdateModal={showUpdateModal} />
        </>
      )}
    </div>
  );
}

export default DashBoard;

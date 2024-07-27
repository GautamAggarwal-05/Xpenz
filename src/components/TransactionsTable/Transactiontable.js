import React, { useState } from 'react'
import { Button, Radio, Select, Table } from "antd";
import searchImg from "../../assets/search.svg";
import Papa from 'papaparse';
import { toast } from 'react-toastify';
function Transactiontable({transactions,addTransaction,fetchTransaction,showUpdateModal}) {
    const {Option} = Select;
    const [search,setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',  
        },
        {
          title: 'Amout',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',  
          },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Button onClick={() => showUpdateModal(record)}>Update</Button>
            ),
          },
          
      ];

      function exportCsv(){
        const csv = Papa.unparse(transactions, {
          fields: ["name", "type", "date", "amount", "tag"],
          data: transactions
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      function importFromCsv(event) {
        event.preventDefault();
        try {
          Papa.parse(event.target.files[0], {
            header: true,
            complete: async function (results) {
              // Now results.data is an array of objects representing your CSV rows
              for (const transaction of results.data) {
                // Write each transaction to Firebase, you can use the addTransaction function here
                console.log("Transactions", transaction);
                const newTransaction = {
                  ...transaction,
                  amount: parseFloat(transaction.amount),
                };
                await addTransaction(newTransaction, true);
              }
            },
          });
          toast.success("All Transactions Added");
          fetchTransaction();
          event.target.files = null;
        } catch (e) {
          toast.error(e.message);
        }
      }

      let filteredTransactions = transactions.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter));

      const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    }).map((transaction,index) => ({ ...transaction, key: index }));
  return (
    <div
    style={{
      width: "95%",
      padding: "2rem 2rem",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      <div className="input-flex">
        <img src={searchImg} width="16" alt='' />
        <input
          placeholder="Search by Name"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select
        className="select-input"
        onChange={(value) => setTypeFilter(value)}
        value={typeFilter}
        placeholder="Filter"
        allowClear
      >
        <Option value="">All</Option>
        <Option value="income">Income</Option>
        <Option value="expense">Expense</Option>
      </Select>
    </div>

    <div className="my-table">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "1rem",
        }}
      >
        <h2>My Transactions</h2>

        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width: "400px",
          }}
        >
          <button className="btn" onClick={exportCsv}>Export to CSV</button>

          <label htmlFor="file-csv" className="btn btn-blue">Import from CSV</label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            style={{ display: "none" }}
            onChange={importFromCsv}
          />
        </div>
      </div>

      <Table columns={columns}
       dataSource={sortedTransactions}
       rowKey={(record) => record.id}
      />
    </div>
  </div>
)
};

export default Transactiontable

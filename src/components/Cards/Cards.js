import React from 'react'
import "./cards.css"
import{Card,Row} from 'antd'
import Button from '../Button/Button'
function Cards({showExpenseModal , showIncomeModal,income,expense,balance,reset}) {
  return (
    <div>
      <Row className = "my-row">
        <Card bordered={true} className = "my-card" title = "Current Balance">
            <p> ₹{balance}</p>
            <Button text="Reset Balance" blue={true} onClick={reset}/>
        </Card>
        <Card bordered={true} className = "my-card" title = "Total Income">
            <p> ₹{income}</p>
            <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
        </Card>
        <Card bordered={true} className = "my-card" title = "Total Expenses" onClick={showExpenseModal}>
            <p> ₹{expense}</p>
            <Button text="Add Expense" blue={true}/>
        </Card>
      </Row>
    </div>
  )
}

export default Cards

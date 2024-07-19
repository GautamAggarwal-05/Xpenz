import React from 'react';
import { Line, Pie } from '@ant-design/charts';

function ChartsComponent({ sortedTransactions = [] }) {
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  const spendingData = sortedTransactions
    .filter((item) => item.type === 'expense')
    .map((item) => ({
      tag: item.tag,
      amount: item.amount,
    }));

  const config = {
    data,
    xField: 'date',
    yField: 'amount',
    width: 800,
    height: 400,
  };

  const spendingConfig = {
    data: spendingData,
    angleField: 'amount',
    colorField: 'tag',
    width: 400,
  };

  return (
    <div className='charts-wrapper'>
      <div>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line {...config} />
      </div>
      <div>
        <h2 style={{ marginTop: 0 }}>Your Spendings</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
}

export default ChartsComponent;

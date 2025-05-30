// src/components/MonthlyTotal/MonthlyTotal.jsx
import React from 'react';
import './MonthlyTotal.css';

const MonthlyTotal = ({ expenses }) => {
  const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="monthly-total">
      <h2>Total del Mes</h2>
      <p>${total.toLocaleString()}</p>
    </div>
  );
};

export default MonthlyTotal;

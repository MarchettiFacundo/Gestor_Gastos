// src/components/ExpensePieChart/ExpensePieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ExpensePieChart.css';

const ExpensePieChart = ({ expenses, tags }) => {
  // Agrupar los gastos por etiqueta
  const grouped = expenses.reduce((acc, exp) => {
    const tagId = exp.tagIds?.[0];
    if (!acc[tagId]) acc[tagId] = 0;
    acc[tagId] += exp.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([tagId, total]) => ({
    name: tags[tagId]?.name || 'Desconocido',
    value: total,
    color: tags[tagId]?.color || '#ccc',
  }));

  return (
    <div className="chart-container">
      <h2>Distribución por Categoría</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;

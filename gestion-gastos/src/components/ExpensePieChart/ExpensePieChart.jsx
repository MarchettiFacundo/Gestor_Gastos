// src/components/ExpensePieChart/ExpensePieChart.jsx
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./ExpensePieChart.css";
import SelectedTagExpenses from "../SelectedTagExpenses/SelectedTagExpenses";

const ExpensePieChart = ({ expenses, tags }) => {
  const [selectedTagId, setSelectedTagId] = useState(null);

  const dataMap = {};

  expenses.forEach((exp) => {
    const tagId = exp.tagIds?.[0];
    if (!tagId || !tags[tagId]) return;

    const tagName = tags[tagId].name;
    const tagColor = tags[tagId].color;

    if (!dataMap[tagId]) {
      dataMap[tagId] = { tagId, name: tagName, value: 0, color: tagColor };
    }
    dataMap[tagId].value += exp.amount;
  });

  const data = Object.values(dataMap);
  const handleClick = (data, index) => {
    setSelectedTagId(data.payload.tagId);
  };

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            label={({ name, value }) => `$${value.toLocaleString()}`}
            labelLine={false}
            onClick={handleClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
      {selectedTagId && (
        <SelectedTagExpenses
          selectedTagId={selectedTagId}
          expenses={expenses}
          tags={tags}
          onClose={() => setSelectedTagId(null)}
        />
      )}
    </div>
  );
};

export default ExpensePieChart;

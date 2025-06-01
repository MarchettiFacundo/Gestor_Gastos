// src/components/SelectedDayExpenses/SelectedDayExpenses.jsx
import React from 'react';
import './SelectedDayExpenses.css';

const SelectedDayExpenses = ({ selectedDay, expenses, tags, onClose }) => {
  if (!selectedDay) return null;

  const filteredExpenses = expenses.filter(exp => {
    const date = exp.date.toDate();
    return date.toDateString() === selectedDay.toDateString();
  });

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>Gastos del {selectedDay.toLocaleDateString()}</h3>
        {filteredExpenses.length === 0 ? (
          <p>No hay gastos este día.</p>
        ) : (
          <ul>
            {filteredExpenses.map(exp => (
              <li key={exp.id}>
                <span>{exp.description}</span> - 
                <strong> ${exp.amount.toLocaleString()}</strong> - 
                <span style={{ color: tags[exp.tagIds[0]]?.color }}>
                  {tags[exp.tagIds[0]]?.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectedDayExpenses;

// src/components/SelectedTagExpenses/SelectedTagExpenses.jsx
import React from 'react';
import './SelectedTagExpenses.css';

const SelectedTagExpenses = ({ selectedTagId, expenses, tags, onClose }) => {
  const tag = tags[selectedTagId];
  if (!selectedTagId || !tag) return null;

  const filteredExpenses = expenses.filter(exp =>
    exp.tagIds?.includes(selectedTagId)
  );

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>
          Gastos de: <span style={{ color: tag.color }}>{tag.name}</span>
        </h3>
        {filteredExpenses.length === 0 ? (
          <p>No hay gastos con esta etiqueta.</p>
        ) : (
          <ul>
            {filteredExpenses.map(exp => (
              <li key={exp.id}>
                <span>{exp.description}</span> - 
                <strong> ${exp.amount.toLocaleString()}</strong> - 
                {exp.date.toDate().toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectedTagExpenses;

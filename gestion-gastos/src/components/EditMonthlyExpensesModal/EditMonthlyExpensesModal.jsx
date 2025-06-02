// src/components/EditMonthlyExpensesModal/EditMonthlyExpensesModal.jsx
import React, { useState } from "react";
import "./EditMonthlyExpensesModal.css";
import { format } from "date-fns";

const EditMonthlyExpensesModal = ({
  visible,
  onClose,
  expenses,
  tags,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [editedExpenses, setEditedExpenses] = useState(() => {
    return expenses.map((exp) => ({
      ...exp,
      date: exp.date.toDate().toISOString().split("T")[0], // yyyy-MM-dd
    }));
  });

  const handleChange = (id, field, value) => {
    setEditedExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleSave = (expense) => {
    const updatedExpense = {
      ...expense,
      amount: Number(expense.amount),
      date: new Date(expense.date),
    };
    onUpdateExpense(expense.id, updatedExpense);
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Gastos del Mes</h2>
        <ul className="edit-expense-list">
          {editedExpenses.map((exp) => (
            <li key={exp.id} className="edit-expense-item">
              <input
                type="number"
                value={exp.amount}
                onChange={(e) => handleChange(exp.id, "amount", e.target.value)}
              />
              <input
                type="text"
                value={exp.description}
                onChange={(e) => handleChange(exp.id, "description", e.target.value)}
              />
              <input
                type="date"
                value={exp.date}
                onChange={(e) => handleChange(exp.id, "date", e.target.value)}
              />
              <select
                value={exp.tagIds?.[0] || ""}
                onChange={(e) => handleChange(exp.id, "tagIds", [e.target.value])}
              >
                {Object.entries(tags).map(([id, tag]) => (
                  <option key={id} value={id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <div className="expense-actions">
                <button onClick={() => handleSave(exp)}>💾</button>
                <button onClick={() => onDeleteExpense(exp.id)}>🗑</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="close-modal-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default EditMonthlyExpensesModal;

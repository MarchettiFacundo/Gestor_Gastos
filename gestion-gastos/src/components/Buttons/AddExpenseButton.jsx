// src/components/AddExpenseButton/AddExpenseButton.jsx
import React, { useState } from 'react';
import AddExpenseForm from '../AddExpenseForm/AddExpenseForm';
import './AddExpenseButton.css';

const AddExpenseButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="add-expense-button" onClick={toggleForm}>
        + Agregar Gasto
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleForm}>×</button>
            <AddExpenseForm />
          </div>
        </div>
      )}
    </>
  );
};

export default AddExpenseButton;

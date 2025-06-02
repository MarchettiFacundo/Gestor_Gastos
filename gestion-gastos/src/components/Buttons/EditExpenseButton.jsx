// src/components/AddExpenseButton/AddExpenseButton.jsx
import React, { useState } from 'react';
import EditMonthlyExpensesModal from '../EditMonthlyExpensesModal/EditMonthlyExpensesModal';
import './AddExpenseButton.css';

const EditExpenseButton = ({ currentMonthExpenses, tags }) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => setIsOpen(prev => !prev);

  return (
    <>
      <button className="edit-expense-button" onClick={toggleForm}>
        🖍 Editar gastos
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleForm}>×</button>
            <EditMonthlyExpensesModal
              expenses={currentMonthExpenses}
              tags={tags}
              onClose={toggleForm}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EditExpenseButton;

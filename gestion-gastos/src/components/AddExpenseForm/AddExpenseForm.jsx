// src/components/AddExpenseForm/AddExpenseForm.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import './AddExpenseForm.css';

const AddExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  // Etiqueta nueva
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#000000');
  const [showNewTagForm, setShowNewTagForm] = useState(false);

  // Formato de monto
  const formatAmount = (value) => {
    const numeric = value.replace(/[^\d]/g, '');
    return `$ ${Number(numeric).toLocaleString()}`;
  };

  const parseAmount = (formatted) => {
    return parseFloat(formatted.replace(/[^\d]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description || !date || !selectedTag) {
      alert("Por favor completá todos los campos.");
      return;
    }

    const newExpense = {
      amount: parseAmount(amount),
      description,
      date: Timestamp.fromDate(new Date(date)),
      tagIds: [selectedTag],
      createdAt: Timestamp.now()
    };

    try {
      await addDoc(collection(db, 'expenses'), newExpense);
      setAmount('');
      setDescription('');
      setDate('');
      setSelectedTag(null);
      alert('Gasto guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
      alert('Hubo un error al guardar el gasto.');
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'tags'), {
        name: newTagName.trim(),
        color: newTagColor
      });
      const newTag = { id: docRef.id, name: newTagName.trim(), color: newTagColor };
      setAllTags(prev => [...prev, newTag]);
      setNewTagName('');
      setNewTagColor('#000000');
      setShowNewTagForm(false);
    } catch (error) {
      console.error('Error al crear la etiqueta:', error);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      const tagSnapshot = await getDocs(collection(db, 'tags'));
      const tags = tagSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllTags(tags);
    };
    fetchTags();
  }, []);

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Agregar Gasto</h2>

      <input
        type="text"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(formatAmount(e.target.value))}
      />

      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="tag-selection">
        <p>Seleccionar etiqueta:</p>
        <div className="tag-list">
          {allTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              style={{
                backgroundColor: tag.color,
                opacity: selectedTag === tag.id ? 1 : 0.5
              }}
              className="tag-button"
              onClick={() => setSelectedTag(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="new-tag-toggle">
        <button
          type="button"
          onClick={() => setShowNewTagForm(!showNewTagForm)}
          className="new-tag-toggle-button"
          title="Crear nueva etiqueta"
        >
          ➕
        </button>
      </div>

      {showNewTagForm && (
        <div className="new-tag-form">
          <input
            type="text"
            placeholder="Nombre de etiqueta"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
          <input
            type="color"
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
          />
          <button type="button" onClick={handleAddTag}>
            Guardar Etiqueta
          </button>
        </div>
      )}

      <button type="submit" className="submit-button">
        Agregar
      </button>
    </form>
  );
};

export default AddExpenseForm;

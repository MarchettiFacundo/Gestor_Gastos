// src/components/AddExpenseForm/AddExpenseForm.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import "./AddExpenseForm.css";

const AddExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  // Etiqueta nueva
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#000000");
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [showEditTags, setShowEditTags] = useState(false);

  // Formato de monto
  const formatAmount = (value) => {
    const numeric = value.replace(/[^\d]/g, "");
    return `$ ${Number(numeric).toLocaleString()}`;
  };

  const parseAmount = (formatted) => {
    return parseFloat(formatted.replace(/[^\d]/g, ""));
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
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, "expenses"), newExpense);
      setAmount("");
      setDescription("");
      setDate("");
      setSelectedTag(null);
      alert("Gasto guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el gasto:", error);
      alert("Hubo un error al guardar el gasto.");
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "tags"), {
        name: newTagName.trim(),
        color: newTagColor,
      });
      const newTag = {
        id: docRef.id,
        name: newTagName.trim(),
        color: newTagColor,
      };
      setAllTags((prev) => [...prev, newTag]);
      setNewTagName("");
      setNewTagColor("#000000");
      setShowNewTagForm(false);
    } catch (error) {
      console.error("Error al crear la etiqueta:", error);
    }
  };
  // NUEVA FUNCIÓN PARA EDITAR ETIQUETA
  const handleEditTag = async (id, newName, newColor) => {
    try {
      await updateDoc(doc(db, "tags", id), { name: newName, color: newColor });
      setAllTags((tags) =>
        tags.map((tag) =>
          tag.id === id ? { ...tag, name: newName, color: newColor } : tag
        )
      );
    } catch (err) {
      console.error("Error editando etiqueta:", err);
    }
  };

  // NUEVA FUNCIÓN PARA ELIMINAR ETIQUETA
  const handleDeleteTag = async (id) => {
    try {
      await deleteDoc(doc(db, "tags", id));
      setAllTags((tags) => tags.filter((tag) => tag.id !== id));
      if (selectedTag === id) setSelectedTag(null);
    } catch (err) {
      console.error("Error eliminando etiqueta:", err);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      const tagSnapshot = await getDocs(collection(db, "tags"));
      const tags = tagSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
          {allTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              style={{
                backgroundColor: tag.color,
                opacity: selectedTag === tag.id ? 1 : 0.5,
              }}
              className="tag-button"
              onClick={() => setSelectedTag(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tag-controls">
        <button
          type="button"
          onClick={() => setShowNewTagForm(!showNewTagForm)}
          className="tag-control-button"
          title="Crear nueva etiqueta"
        >
          ➕
        </button>

        <button
          type="button"
          onClick={() => setShowEditTags(!showEditTags)}
          className="tag-control-button"
          title="Editar etiquetas existentes"
        >
          🖍
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
          <label className="color-picker-wrapper">
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="hidden-color-input"
            />
            <div
              className="custom-color-circle"
              style={{ backgroundColor: newTagColor }}
            />
          </label>

          <button type="button" onClick={handleAddTag}>
            Guardar Etiqueta
          </button>
        </div>
      )}

      {showEditTags && (
        <div className="tag-list-editable">
          <h4>Editar etiquetas existentes:</h4>
          {allTags.map((tag) => (
            <div key={tag.id} className="tag-edit-item">
              <input
                type="text"
                value={tag.name}
                onChange={(e) =>
                  handleEditTag(tag.id, e.target.value, tag.color)
                }
              />
              <label className="color-picker-wrapper">
                <input
                  type="color"
                  value={tag.color}
                  onChange={(e) =>
                    handleEditTag(tag.id, tag.name, e.target.value)
                  }
                  className="hidden-color-input"
                />
                <div
                  className="custom-color-circle"
                  style={{ backgroundColor: tag.color }}
                />
              </label>

              <button type="button" onClick={() => handleDeleteTag(tag.id)}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="submit" className="submit-button">
        Agregar
      </button>
    </form>
  );
};

export default AddExpenseForm;

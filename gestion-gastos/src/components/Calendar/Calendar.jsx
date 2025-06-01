// src/components/Calendar/Calendar.jsx
import React, { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./Calendar.css";
import MonthlyTotal from "../MonthlyTotal/MonthlyTotal.jsx";
import ExpensePieChart from "../ExpensePieChart/ExpensePieChart";
import SelectedDayExpenses from "../SelectedDayExpenses/SelectedDayExpenses.jsx";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [tags, setTags] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    // Suscripción a gastos en tiempo real
    const unsubscribeExpenses = onSnapshot(
      collection(db, "expenses"),
      (snapshot) => {
        const filteredExpenses = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((exp) => {
            const date = exp.date.toDate();
            return (
              date.getMonth() === currentMonth.getMonth() &&
              date.getFullYear() === currentMonth.getFullYear()
            );
          });

        setExpenses(filteredExpenses);
      }
    );

    // Suscripción a etiquetas en tiempo real
    const unsubscribeTags = onSnapshot(collection(db, "tags"), (snapshot) => {
      const tagsData = {};
      snapshot.forEach((doc) => {
        tagsData[doc.id] = doc.data();
      });
      setTags(tagsData);
    });

    // Limpiar suscripciones al desmontar o cambiar de mes
    return () => {
      unsubscribeExpenses();
      unsubscribeTags();
    };
  }, [currentMonth]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getColorsForDay = (day) => {
    const expensesOfDay = expenses.filter((exp) => {
      const expDate = exp.date.toDate();
      return expDate.toDateString() === day.toDateString();
    });

    const colors = expensesOfDay.map((exp) => {
      const tag = tags[exp.tagIds?.[0]];
      return tag?.color || "#ccc";
    });

    return [...new Set(colors)];
  };

  const renderCalendar = () => {
    const firstWeekDay = getDay(startOfMonth(currentMonth));
    const emptyCells = Array.from({ length: firstWeekDay }, (_, i) => (
      <div key={`empty-${i}`} className="calendar-day empty"></div>
    ));

    return (
      <div className="calendar-grid">
        {emptyCells}
        {daysInMonth.map((day) => {
          const colors = getColorsForDay(day);

          return (
            <div
              key={day.toISOString()}
              className="calendar-day"
              onClick={() => setSelectedDay(day)}
            >
              <div className="day-number">{format(day, "d")}</div>
              <div className="dots-container">
                {colors.map((color, i) => (
                  <span
                    key={i}
                    className="color-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>◀</button>
        <h2 className="calendar-title">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={handleNextMonth}>▶</button>
      </div>

      {/* NUEVOS COMPONENTES */}
      <MonthlyTotal expenses={expenses} />
      <ExpensePieChart expenses={expenses} tags={tags} />

      {/* CALENDARIO */}
      {renderCalendar()}
      {selectedDay && (
        <SelectedDayExpenses
          selectedDay={selectedDay}
          expenses={expenses}
          tags={tags}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default Calendar;

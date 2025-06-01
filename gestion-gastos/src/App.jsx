import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AddExpenseButton from './components/Buttons/AddExpenseButton.jsx';
import Calendar from './components/Calendar/Calendar';


function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <AddExpenseButton />
      <Calendar />
    </div>
  );
}
export default App

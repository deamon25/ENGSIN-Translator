import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import for Router and Routes
import Translator from './components/Translator';
import Additem from "./components/Definitions/Admin/AddItem/Additem";
import DashBoard from "./components/Definitions/Admin/DashBoard/DashBoard";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Translator />} />
          <Route path="/additem" element={<Additem />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import EditorPage from './pages/EditorPage';
import ViewerPage from './pages/ViewerPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Main Editor Route */}
          <Route path="/" element={<EditorPage />} />
          
          {/* Viewer Route */}
          <Route path="/v/:id" element={<ViewerPage />} />

          {/* Admin Dashboard Route */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

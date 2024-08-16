import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from '../components/App/App.jsx';
import Login from '../components/Login/login.jsx';
import Register from '../components/Register/register.jsx';

const RoutesComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [emptyShow, setEmptyShow] = useState(true);

  
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : (
            <Login 
              setIsAuthenticated={setIsAuthenticated}
              setTasks={setTasks}
              setEmptyShow={setEmptyShow}
            />
          )} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : (
            <Register 
              setShowLogin={() => {}} 
            />
          )} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? (
            <App 
              tasks={tasks}
              setTasks={setTasks}
              emptyShow={emptyShow}
              setEmptyShow={setEmptyShow}
              handleLogout={handleLogout} 
            />
          ) : (
            <Navigate to="/login" />
          )} 
        />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;

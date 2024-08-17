import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../components/App/App.jsx';
import Login from '../components/Login/login.jsx';
import Register from '../components/Register/register.jsx';


const ConditionalRoute = ({ condition, redirectTo, component }) => {
  return condition ? component : <Navigate to={redirectTo} />;
};

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

  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <ConditionalRoute
          condition={!isAuthenticated}
          redirectTo="/"
          component={<Login setIsAuthenticated={setIsAuthenticated} setTasks={setTasks} setEmptyShow={setEmptyShow} />}
        />
      ),
    },
    {
      path: "/register",
      element: (
        <ConditionalRoute
          condition={!isAuthenticated}
          redirectTo="/"
          component={<Register setShowLogin={() => {}} />}
        />
      ),
    },
    {
      path: "/",
      element: (
        <ConditionalRoute
          condition={isAuthenticated}
          redirectTo="/login"
          component={<App tasks={tasks} setTasks={setTasks} emptyShow={emptyShow} setEmptyShow={setEmptyShow} handleLogout={handleLogout} />}
        />
      ),
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default RoutesComponent;

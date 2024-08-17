import React, { useState, useEffect, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// 使用 React.lazy() 实现懒加载
const App = React.lazy(() => import('../components/App/App.jsx'));
const Login = React.lazy(() => import('../components/Login/login.jsx'));
const Register = React.lazy(() => import('../components/Register/register.jsx'));

// 单独抽取的函数用于创建条件路由
const createConditionalRoute = (condition, redirectTo, element) => {
  return condition ? element : <Navigate to={redirectTo} />;
};

const RoutesComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [emptyShow, setEmptyShow] = useState(true);

  // 监控 token 变化，更新 isAuthenticated 状态
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    
    window.addEventListener('storage', handleStorageChange);

    // 清理事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: createConditionalRoute(
        !isAuthenticated,
        "/",
        <Login setIsAuthenticated={setIsAuthenticated} setTasks={setTasks} setEmptyShow={setEmptyShow} />
      ),
    },
    {
      path: "/register",
      element: createConditionalRoute(
        !isAuthenticated,
        "/",
        <Register setShowLogin={() => {}} />
      ),
    },
    {
      path: "/",
      element: createConditionalRoute(
        isAuthenticated,
        "/login",
        <App tasks={tasks} setTasks={setTasks} emptyShow={emptyShow} setEmptyShow={setEmptyShow} handleLogout={handleLogout} />
      ),
    },
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default RoutesComponent;

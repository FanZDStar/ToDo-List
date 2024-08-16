import React from 'react';
import ReactDOM from 'react-dom/client'; 
import RoutesComponent from './router/index'; 

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <RoutesComponent />
  </React.StrictMode>
);

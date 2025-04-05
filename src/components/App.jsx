import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Registro from './Registro/Registro';
import { RouterApp } from './RouterApp';




const App = () => {
  return (
    
      <BrowserRouter>
        <RouterApp/>
        </BrowserRouter>
    
  );
};

export default App;
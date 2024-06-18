// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Auth/Login';
import PrivateRoute from './Private/PrivateRoute';
import Dashboard from './Admin/Dashboard';

const AppRoutes = () => {
  

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;

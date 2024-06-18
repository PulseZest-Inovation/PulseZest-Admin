import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Auth/Login';
import PrivateRoute from './Private/PrivateRoute';
import Dashboard from './Admin/Dashboard';
import AppDevelopment from './pages/appDevelopment';
import AppDevelopmentDetail from './pages/AppDevelopmentDetail/appDevelopmentDetail';
import WebDevelopment from './pages/webDevelopment'; // Import WebDevelopment component
import WebDevelopmentDetail from './pages/WebDevelopmentDetail/webDevelopmentDetail'; // Import WebDevelopmentDetail component

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/app-development" element={<AppDevelopment />} />
      <Route path="/app-development/:id" element={<AppDevelopmentDetail />} />
      <Route path="/web-development" element={<WebDevelopment />} />
      <Route path="/web-development/:id" element={<WebDevelopmentDetail />} />
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

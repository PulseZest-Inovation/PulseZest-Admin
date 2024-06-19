import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Auth/Login';
import PrivateRoute from './Private/PrivateRoute';
import Dashboard from './Admin/Dashboard';
import AppDevelopment from './pages/appDevelopment';
import AppDevelopmentDetail from './pages/Details/AppDevelopmentDetail/appDevelopmentDetail';
import WebDevelopment from './pages/webDevelopment';
import WebDevelopmentDetail from './pages/Details/WebDevelopmentDetail/webDevelopmentDetail';
import Employee from './pages/employee';
import Intern from './pages/intern';
import EmployeeDetails from './pages/Details/EmployeeDetails/employeeDetails'; // Ensure correct import and case sensitivity

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/app-development" element={<AppDevelopment />} />
      <Route path="/app-development/:id" element={<AppDevelopmentDetail />} />
      <Route path="/web-development" element={<WebDevelopment />} />
      <Route path="/web-development/:id" element={<WebDevelopmentDetail />} />
      <Route path="/employee-details" element={<Employee />} /> 
      <Route path="/employee-details/:id" element={<EmployeeDetails />} /> 
      <Route path="/intern-details" element={<Intern />} /> 
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

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Auth/Login';
import Dashboard from './Admin/Dashboard';
import AppDevelopment from './pages/appDevelopment';
import AppDevelopmentDetail from './pages/Details/AppDevelopmentDetail/appDevelopmentDetail';
import WebDevelopment from './pages/webDevelopment';
import WebDevelopmentDetail from './pages/Details/WebDevelopmentDetail/webDevelopmentDetail';
import Employee from './pages/employee';
import Intern from './pages/intern';
import EmployeeDetails from './pages/Details/EmployeeDetails/employeeDetails';
import InternDetails from './pages/Details/InternDetails/internDetails';
import AttendancePage from './components/Attendance/AttendancePage';
import AttendanceDetailsPage from './components/Attendance/AttendanceDetailsPage';
import ProtectedRoute from './Firebase/ProtectedRoute'; // Adjust the import based on your project structure
import UnauthorizedPage from './Auth/UnauthorizedPage'; // Adjust the import based on your project structure

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/app-development" element={<ProtectedRoute><AppDevelopment /></ProtectedRoute>} />
      <Route path="/app-development/:id" element={<ProtectedRoute><AppDevelopmentDetail /></ProtectedRoute>} />
      <Route path="/web-development" element={<ProtectedRoute><WebDevelopment /></ProtectedRoute>} />
      <Route path="/web-development/:id" element={<ProtectedRoute><WebDevelopmentDetail /></ProtectedRoute>} />
      <Route path="/employee-details" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
      <Route path="/employee-details/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
      <Route path="/intern-details" element={<ProtectedRoute><Intern /></ProtectedRoute>} />
      <Route path="/intern-details/:id" element={<ProtectedRoute><InternDetails /></ProtectedRoute>} />
      <Route path="/user-attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
      <Route path="/attendance-details/:userId" element={<ProtectedRoute><AttendanceDetailsPage /></ProtectedRoute>} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* Catch-all route */}
      <Route path="*" element={<UnauthorizedPage />} />
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

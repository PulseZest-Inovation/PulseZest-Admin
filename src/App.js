import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Auth/Login';
import Dashboard from './Admin/Dashboard';
import AppDevelopment from './pages/V1SidebarPages/appDevelopment';
import AppDevelopmentDetail from './pages/Details/AppDevelopmentDetail/appDevelopmentDetail';
import WebDevelopment from './pages/V1SidebarPages/webDevelopment';
import WebDevelopmentDetail from './pages/Details/WebDevelopmentDetail/webDevelopmentDetail';
import Employee from './pages/V1SidebarPages/employee';
import Intern from './pages/V1SidebarPages/intern';
import EmployeeDetails from './pages/Details/EmployeeDetails/employeeDetails';
import InternDetails from './pages/Details/InternDetails/internDetails';
import AttendancePage from './components/Employee-Attendance/Attendance/AttendancePage';
import AttendanceDetailsPage from './components/Employee-Attendance/Attendance/AttendanceDetailsPage';
import ProtectedRoute from './Firebase/ProtectedRoute'; // Adjust the import based on your project structure
import UnauthorizedPage from './Auth/Unauthorized/UnauthorizedPage'; 
import ManageEmp from "./pages/Details/EmployeeDetails/ManageEmployee/manageEmp";
import PulseZestLearning from './Learning/Pages/LearningAdmin/learningAdmin';
import { auth } from './Firebase/Firebase'; 



const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {user ? (
        <>
          <Route path="/admin/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pulsezest-learning" element={<ProtectedRoute><PulseZestLearning /></ProtectedRoute>} />
          <Route path="/app-development" element={<ProtectedRoute><AppDevelopment /></ProtectedRoute>} />
          <Route path="/app-development/:id" element={<ProtectedRoute><AppDevelopmentDetail /></ProtectedRoute>} />
          <Route path="/web-development" element={<ProtectedRoute><WebDevelopment /></ProtectedRoute>} />
          <Route path="/web-development/:id" element={<ProtectedRoute><WebDevelopmentDetail /></ProtectedRoute>} />
          <Route path="/employee-details" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
          <Route path="/employee-details/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
          <Route path="/manage-employee/:id" element={<ProtectedRoute><ManageEmp /></ProtectedRoute>} />
          <Route path="/intern-details" element={<ProtectedRoute><Intern /></ProtectedRoute>} />
          <Route path="/intern-details/:id" element={<ProtectedRoute><InternDetails /></ProtectedRoute>} />
          <Route path="/user-attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
          <Route path="/attendance-details/:userId" element={<ProtectedRoute><AttendanceDetailsPage /></ProtectedRoute>} />

        


        </>
      ) : (
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      )}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/unauthorized" />} />
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

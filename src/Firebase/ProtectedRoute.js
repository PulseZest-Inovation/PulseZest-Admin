import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './Firebase'; // Adjust the import based on your project structure

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;
  return user ? children : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;

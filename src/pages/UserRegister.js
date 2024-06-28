import React, { useState } from 'react';
import Navbar from './UserRegister/Navbar';
import AddUserForm from './UserRegister/AddUserForm';
import EmployeeForm from './UserRegister/employeeForm';
import InternForm from './UserRegister/internForm';
import { Container } from '@mui/material';

export default function UserRegistration() {
  const [view, setView] = useState('addUser');

  const handleViewChange = (newView) => {
    console.log("View changed to:", newView); // Debug log
    setView(newView);
  };

  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onViewChange={handleViewChange} /> {/* Pass onViewChange prop */}
      <Container maxWidth="lg" style={{ flexGrow: 1, overflow: 'auto', padding: '20px' }}>
        {view === 'addUser' && <AddUserForm />}
        {view === 'employee' && <EmployeeForm />}
        {view === 'intern' && <InternForm />}
      </Container>
    </div>
  );
}

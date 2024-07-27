import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Badge } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import styled from 'styled-components';

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: #4caf50;
    color: #4caf50;
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    color: #0d47a1; // Dark blue color for text
    font-weight: bold; // Bold text

    &:hover {
      background-color: #e3f2fd; // Light blue background on hover
      border-left: 5px solid white; // White hover line
      transition: all 0.3s ease-in-out; // Smooth transition
    }

    &:hover .MuiListItemText-primary {
      font-weight: bold;
    }
  }
`;

const LogoutButton = styled.button`
  background-color: #0d47a1;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1565c0;
  }
`;

const Sidebar = () => {
  const auth = getAuth();
  const location = useLocation();
  const [clickedOnProposals, setClickedOnProposals] = useState(false);
  const navigate = useNavigate();



  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <List>
      <StyledListItem button component={Link} to="/" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Home" />
      </StyledListItem>
      <StyledListItem button component={Link} to="/pulsezest-learning" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="PulseZest Learning" />
      </StyledListItem>
      <StyledListItem button component={Link} to="employee-details" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Employee Details" />
      </StyledListItem>
      <StyledListItem button component={Link} to="intern-details" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Intern Details" />
      </StyledListItem>
      <StyledListItem button component={Link} to="app-development" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="App Development" />
      </StyledListItem>
      <StyledListItem button component={Link} to="web-development" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Web Development" />
      </StyledListItem>
      <StyledListItem button component={Link} to="offers" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Offers / Forms" />
      </StyledListItem>
      <StyledListItem button component={Link} to="user-registration" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="User Registration" />
      </StyledListItem>
      <StyledListItem button component={Link} to="user-attendance" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="User Attendance" />
      </StyledListItem>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </List>
  );
};

export default Sidebar;

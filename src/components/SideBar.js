import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Badge } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import styled from 'styled-components';
import { db } from "../Firebase/Firebase"; // Adjust the path as necessary

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
  const [newProposalCount, setNewProposalCount] = useState(0);
  const [clickedOnProposals, setClickedOnProposals] = useState(false);
  const navigate = useNavigate();

  // UseEffect to count new proposals
  useEffect(() => {
    const proposalCollection = collection(db, 'proposals');
    const q = query(proposalCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.filter(doc => doc.data().status === 'pending').length;
      setNewProposalCount(count);
    });

    return () => unsubscribe();
  }, []);

  // Reset newProposalCount when navigating to Proposals page
  useEffect(() => {
    if (location.pathname === '/proposals' && clickedOnProposals) {
      setNewProposalCount(0);
      setClickedOnProposals(false); // Reset clicked state
    }
  }, [location, clickedOnProposals]);

  const handleProposalsClick = () => {
    setClickedOnProposals(true);
    setNewProposalCount(0); // Mark all new proposals as seen when clicked
  };

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
      <StyledListItem button component={Link} to="proposals" onClick={handleProposalsClick}>
        <StyledBadge badgeContent={newProposalCount > 0 && !clickedOnProposals ? newProposalCount : 0} variant="dot">
          <ListItemText primary="Proposals" />
        </StyledBadge>
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

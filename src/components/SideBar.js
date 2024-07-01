import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
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

const Sidebar = () => {
  const auth = getAuth();
  const location = useLocation();
  const [newProposalCount, setNewProposalCount] = useState(0);
  const [clickedOnProposals, setClickedOnProposals] = useState(false);

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
    signOut(auth);
  };

  return (
    <List>
      <ListItem button component={Link} to="/" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="employee-details" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Employee Details" />
      </ListItem>
      <ListItem button component={Link} to="intern-details" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Intern Details" />
      </ListItem>
      <ListItem button component={Link} to="app-development" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="App Development" />
      </ListItem>
      <ListItem button component={Link} to="web-development" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="Web Development" />
      </ListItem>
      <ListItem button component={Link} to="proposals" onClick={handleProposalsClick}>
        <StyledBadge badgeContent={newProposalCount > 0 && !clickedOnProposals ? newProposalCount : 0} variant="dot">
          <ListItemText primary="Proposals" />
        </StyledBadge>
      </ListItem>
      <ListItem button component={Link} to="user-registration" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="User Registration" />
      </ListItem>
      <ListItem button component={Link} to="user-attendance" onClick={() => setClickedOnProposals(false)}>
        <ListItemText primary="User Attendance" />
      </ListItem>
      <button onClick={handleLogout}>Logout</button>
    </List>
  );
};

export default Sidebar;

import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Sidebar = () => {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="employee">
        <ListItemText primary="Employee Details" />
      </ListItem>
      <ListItem button component={Link} to="intern-details">
        <ListItemText primary="Intern Details" />
      </ListItem>
      <ListItem button component={Link} to="app-development">
        <ListItemText primary="App Development" />
      </ListItem>
      <ListItem button component={Link} to="web-development">
        <ListItemText primary="Web Development" />
      </ListItem>
      <ListItem button component={Link} to="user-registration">
        <ListItemText primary="User Registration" />
      </ListItem>
      <button onClick={handleLogout}>Logout</button>
    </List>
  );
};

export default Sidebar;
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const SidebarV2 = () => {
  return (
    <List>
      <ListItem button component={Link} to="V2-home">
        <ListItemText primary="V2 - Home" />
      </ListItem>
      <ListItem button component={Link} to="notifiaction-portal">
        <ListItemText primary="V2 - Notification" />
      </ListItem>
      <ListItem button component={Link} to="email-temp">
        <ListItemText primary="V2 - Email Temp" />
      </ListItem>
      {/* Add more items as needed */}
    </List>
  );
};

export default SidebarV2;

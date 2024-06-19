import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Navbar({ onViewChange }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          User Registration
        </Typography>
        <Button color="inherit" onClick={() => onViewChange('addUser')}>Client Form</Button>
        <Button color="inherit" onClick={() => onViewChange('employee')}>Employee Form</Button>
        <Button color="inherit" onClick={() => onViewChange('intern')}>Intern Form</Button>
      </Toolbar>
    </AppBar>
  );
}

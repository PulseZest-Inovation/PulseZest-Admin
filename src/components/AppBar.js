import React from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AppBar = ({ onSidebarToggle, isSidebarOpen, onVersionChange }) => {
  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'purple' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onSidebarToggle}
          sx={{ marginRight: 2, ...(isSidebarOpen && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          PulseZest
        </Typography>
        <Button color="inherit" onClick={() => onVersionChange('V1')}>V1</Button>
        <Button color="inherit" onClick={() => onVersionChange('V2')}>V2</Button>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;

import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CssBaseline, Drawer, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Sidebar from '../components/SideBar';
import AppBar from '../components/AppBar';
import Home from '../pages/home'
import AppDevelopment from "../pages/appDevelopment"
import WebDevelopment from "../pages/webDevelopment"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UserResgistration from '../pages/UserRegister';
import Employee from '../pages/employee';
import Intern from '../pages/intern';
import AttendancePage from '../components/Attendance/AttendancePage';
import Proposals from '../pages/Offers';
const drawerWidth = 240;

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
}));

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'isSidebarOpen',
})(({ theme, isSidebarOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: isSidebarOpen ,
  transition: theme.transitions.create(['margin-left', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
}));

const Toolbar = styled('div')(({ theme }) => theme.mixins.toolbar);

const Layout = ({ children, isSidebarOpen, handleSidebarToggle }) => {
  return (
    <Root>
      <CssBaseline />
      <AppBarStyled onSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />
      {isSidebarOpen && (
        <DrawerStyled
          variant="persistent"
          open={isSidebarOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          <IconButton onClick={handleSidebarToggle}>
            <ChevronLeftIcon />
          </IconButton>
          <Sidebar />
        </DrawerStyled>
      )}
      {isSidebarOpen && (
        <DrawerStyled
          variant="temporary"
          open={isSidebarOpen}
          onClose={handleSidebarToggle}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          <IconButton onClick={handleSidebarToggle}>
            <ChevronLeftIcon />
          </IconButton>
          <Sidebar />
        </DrawerStyled>
      )}
      <Main isSidebarOpen={isSidebarOpen}>
        <Toolbar />
        {children}
      </Main>
    </Root>
  );
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Layout isSidebarOpen={isSidebarOpen} handleSidebarToggle={handleSidebarToggle}>
      <Routes>
        <Route path="app-development" element={<AppDevelopment />} />
        <Route path="web-development" element={<WebDevelopment />} />
        <Route path="user-registration" element={<UserResgistration />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="employee-details" element={<Employee />} />
        <Route path="intern-details" element={<Intern />} />
        <Route path="user-attendance" element={<AttendancePage />} />
                 <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;